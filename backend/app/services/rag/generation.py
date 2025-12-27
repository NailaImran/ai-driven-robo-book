"""RAG generation service using OpenAI Assistants API with vector store."""

import os
import uuid
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from app.schemas.rag import Source
from app.core.logging import get_logger

logger = get_logger(__name__)


class RAGService:
    """Service for RAG-based question answering using OpenAI Assistants API."""

    def __init__(self):
        """Initialize OpenAI client and configuration."""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY not set - RAG service will not function")
            api_key = "dummy-key-for-import"  # Allow import but will fail on actual use

        self.client = AsyncOpenAI(api_key=api_key)

        # Vector store ID from user (for textbook content)
        self.vector_store_id = os.getenv(
            "OPENAI_VECTOR_STORE_ID",
            "vs_69355b5bf4988191991e56c07dbc3cc5"
        )

        # Workflow/Assistant ID (if provided)
        self.assistant_id = os.getenv("OPENAI_ASSISTANT_ID", None)

        # Model configuration
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.embedding_model = "text-embedding-3-small"

        logger.info(
            f"RAG service initialized",
            extra={
                "vector_store_id": self.vector_store_id,
                "model": self.model
            }
        )

    async def query(
        self,
        question: str,
        conversation_id: Optional[str] = None,
        max_sources: int = 3,
        temperature: float = 0.7,
    ) -> Dict[str, Any]:
        """
        Answer a question using RAG with OpenAI Assistants API.

        Args:
            question: User's question
            conversation_id: Optional thread ID for conversation continuity
            max_sources: Maximum number of source citations
            temperature: LLM temperature (0.0-2.0)

        Returns:
            Dict with answer, sources, conversation_id, and tokens_used
        """
        try:
            # Create or use existing thread
            if conversation_id:
                thread_id = conversation_id
                logger.info(f"Using existing thread: {thread_id}")
            else:
                thread = await self.client.beta.threads.create()
                thread_id = thread.id
                logger.info(f"Created new thread: {thread_id}")

            # Add user message to thread
            await self.client.beta.threads.messages.create(
                thread_id=thread_id,
                role="user",
                content=question
            )

            # Create or get assistant
            if not self.assistant_id:
                assistant = await self._create_assistant()
                self.assistant_id = assistant.id
            else:
                assistant = await self.client.beta.assistants.retrieve(
                    self.assistant_id
                )

            # Run assistant
            run = await self.client.beta.threads.runs.create(
                thread_id=thread_id,
                assistant_id=self.assistant_id,
                temperature=temperature,
            )

            # Wait for completion
            run = await self._wait_for_run_completion(thread_id, run.id)

            # Get assistant's response
            messages = await self.client.beta.threads.messages.list(
                thread_id=thread_id,
                order="desc",
                limit=1
            )

            answer = ""
            sources = []
            tokens_used = 0

            if messages.data:
                message = messages.data[0]

                # Extract text content
                for content in message.content:
                    if content.type == "text":
                        answer = content.text.value

                        # Extract citations from annotations
                        if hasattr(content.text, 'annotations'):
                            sources = await self._extract_sources(
                                content.text.annotations,
                                max_sources
                            )

            # Get token usage if available
            if hasattr(run, 'usage') and run.usage:
                tokens_used = run.usage.total_tokens

            logger.info(
                f"RAG query completed",
                extra={
                    "thread_id": thread_id,
                    "tokens_used": tokens_used,
                    "sources_count": len(sources)
                }
            )

            return {
                "answer": answer,
                "sources": sources,
                "conversation_id": thread_id,
                "tokens_used": tokens_used,
            }

        except Exception as e:
            logger.error(f"RAG query failed: {str(e)}", exc_info=True)
            raise

    async def query_selection(
        self,
        selected_text: str,
        question: str,
        page_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Answer a question about selected text from a page.

        Args:
            selected_text: Text selected by user
            question: Question about the selected text
            page_url: URL of the page (for context)

        Returns:
            Dict with answer, sources, conversation_id
        """
        # Construct enhanced query with context
        enhanced_query = f"""Based on the following text from the textbook:

\"\"\"{selected_text}\"\"\"

Question: {question}

Please provide a detailed answer based on this context and related course material."""

        if page_url:
            enhanced_query += f"\n\nSource page: {page_url}"

        # Use regular query method
        return await self.query(
            question=enhanced_query,
            max_sources=2,
            temperature=0.5,  # Lower temperature for more factual responses
        )

    async def _create_assistant(self):
        """Create a new assistant with file search enabled."""
        assistant = await self.client.beta.assistants.create(
            name="Humanoid Robotics Textbook Assistant",
            instructions="""You are an expert teaching assistant for a Physical AI and Humanoid Robotics course.

Your role is to:
1. Answer student questions clearly and accurately using the course textbook
2. Provide practical examples and code snippets when relevant
3. Cite specific sections of the textbook when answering
4. Suggest related topics for deeper learning
5. Adapt explanations to the student's level (beginner, intermediate, advanced)

Guidelines:
- Be concise but thorough
- Use technical terms correctly and explain them when first introduced
- Provide step-by-step explanations for complex topics
- Reference specific chapters/sections from the textbook
- If unsure, acknowledge limitations rather than guessing
- Encourage hands-on practice and experimentation""",
            model=self.model,
            tools=[{"type": "file_search"}],
            tool_resources={
                "file_search": {
                    "vector_store_ids": [self.vector_store_id]
                }
            },
        )

        logger.info(f"Created new assistant: {assistant.id}")
        return assistant

    async def _wait_for_run_completion(
        self,
        thread_id: str,
        run_id: str,
        timeout: int = 60
    ):
        """Poll for run completion."""
        import asyncio

        elapsed = 0
        while elapsed < timeout:
            run = await self.client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )

            if run.status == "completed":
                return run
            elif run.status in ["failed", "cancelled", "expired"]:
                raise Exception(f"Run {run.status}: {run.last_error}")

            await asyncio.sleep(1)
            elapsed += 1

        raise TimeoutError(f"Run did not complete within {timeout} seconds")

    async def _extract_sources(
        self,
        annotations: List[Any],
        max_sources: int
    ) -> List[Source]:
        """Extract source citations from message annotations."""
        sources = []

        for annotation in annotations[:max_sources]:
            if annotation.type == "file_citation":
                citation = annotation.file_citation

                # Get file details
                try:
                    file = await self.client.files.retrieve(citation.file_id)

                    # Extract title from filename (e.g., "week-03-ros2.mdx" -> "Week 3: ROS 2")
                    title = self._format_title(file.filename)

                    # Generate URL from filename
                    url = self._generate_url(file.filename)

                    sources.append(Source(
                        title=title,
                        url=url,
                        excerpt=annotation.text,
                        score=1.0  # File search doesn't provide explicit scores
                    ))
                except Exception as e:
                    logger.warning(f"Failed to retrieve file {citation.file_id}: {e}")
                    continue

        return sources

    def _format_title(self, filename: str) -> str:
        """Format filename into readable title."""
        # Remove extension
        name = filename.replace('.mdx', '').replace('.md', '')

        # Convert hyphens to spaces and title case
        title = name.replace('-', ' ').title()

        return title

    def _generate_url(self, filename: str) -> str:
        """Generate documentation URL from filename."""
        # Base URL for the textbook
        base_url = "/docs"

        # Extract path from filename
        # Example: "02-ros2-fundamentals/week-03.mdx" -> "/docs/02-ros2-fundamentals/week-03"
        path = filename.replace('.mdx', '').replace('.md', '')

        return f"{base_url}/{path}"


# Singleton instance
rag_service = RAGService()
