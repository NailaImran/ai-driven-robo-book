"""Vector database service for semantic search and recommendations."""

from typing import List, Optional
import logging
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
import openai

from app.config import settings

logger = logging.getLogger(__name__)


class VectorService:
    """Service for Qdrant vector database operations."""

    def __init__(self):
        """Initialize Qdrant client and OpenAI."""
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None,
        )

        openai.api_key = settings.OPENAI_API_KEY
        self.embedding_model = "text-embedding-3-small"
        self.collection_name = settings.QDRANT_COLLECTION_NAME

    def ensure_collection_exists(self) -> bool:
        """
        Ensure lesson collection exists in Qdrant.

        Returns:
            True if collection exists or was created
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            for collection in collections.collections:
                if collection.name == self.collection_name:
                    logger.info(f"Collection '{self.collection_name}' already exists")
                    return True

            # Create collection if doesn't exist
            self.client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=1536,  # text-embedding-3-small dimension
                    distance=Distance.COSINE,
                ),
            )
            logger.info(f"Created collection '{self.collection_name}'")
            return True

        except Exception as e:
            logger.error(f"Error ensuring collection: {e}")
            return False

    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for text using OpenAI.

        Args:
            text: Text to embed

        Returns:
            Embedding vector or None if error

        Raises:
            RuntimeError: If API key not set or request fails
        """
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY not configured")

        try:
            response = openai.Embedding.create(
                model=self.embedding_model,
                input=text,
            )
            return response["data"][0]["embedding"]
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    def prepare_embedding_text(self, lesson_data: dict) -> str:
        """
        Prepare text for embedding from lesson data.

        Args:
            lesson_data: Lesson dictionary with title, description, keywords, content

        Returns:
            Combined text for embedding
        """
        parts = [
            f"Title: {lesson_data.get('title', '')}",
            f"Description: {lesson_data.get('description', '')}",
            f"Keywords: {', '.join(lesson_data.get('keywords', []))}",
        ]

        # Add first 2000 chars of content
        content = lesson_data.get("content_text", "")
        if content:
            parts.append(f"Content: {content[:2000]}")

        return "\n\n".join(parts)

    def upsert_lesson(self, lesson_id: str, lesson_data: dict) -> bool:
        """
        Upsert lesson vector to Qdrant.

        Args:
            lesson_id: Unique lesson ID
            lesson_data: Lesson data (title, description, keywords, content_text, etc.)

        Returns:
            True if successful
        """
        try:
            # Ensure collection exists
            if not self.ensure_collection_exists():
                return False

            # Prepare text for embedding
            embedding_text = self.prepare_embedding_text(lesson_data)

            # Generate embedding
            vector = self.generate_embedding(embedding_text)
            if not vector:
                return False

            # Prepare payload (metadata)
            payload = {
                "lesson_id": lesson_id,
                "chapter_id": lesson_data.get("chapter_id", ""),
                "title": lesson_data.get("title", ""),
                "difficulty": lesson_data.get("difficulty", ""),
                "keywords": lesson_data.get("keywords", []),
                "prerequisites": lesson_data.get("prerequisites", []),
                "description": lesson_data.get("description", "")[:500],  # Limit description length
            }

            # Create point
            point = PointStruct(
                id=hash(lesson_id) % 2**63,  # Convert lesson_id to numeric ID
                vector=vector,
                payload=payload,
            )

            # Upsert to Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point],
            )

            logger.info(f"Upserted lesson {lesson_id} to vector DB")
            return True

        except Exception as e:
            logger.error(f"Error upserting lesson {lesson_id}: {e}")
            return False

    def search_similar_lessons(
        self,
        query_text: str,
        limit: int = 5,
        filters: Optional[dict] = None,
    ) -> List[dict]:
        """
        Search for similar lessons using semantic similarity.

        Args:
            query_text: Query text
            limit: Number of results to return
            filters: Optional Qdrant filters (e.g., {"key": "value"})

        Returns:
            List of similar lessons with scores
        """
        try:
            # Generate query embedding
            query_vector = self.generate_embedding(query_text)
            if not query_vector:
                logger.error("Failed to generate query embedding")
                return []

            # Search in Qdrant
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                query_filter=filters,
            )

            # Extract results
            results = []
            for scored_point in search_result:
                results.append(
                    {
                        "lesson_id": scored_point.payload.get("lesson_id", ""),
                        "title": scored_point.payload.get("title", ""),
                        "chapter_id": scored_point.payload.get("chapter_id", ""),
                        "difficulty": scored_point.payload.get("difficulty", ""),
                        "keywords": scored_point.payload.get("keywords", []),
                        "similarity_score": scored_point.score,
                    }
                )

            return results

        except Exception as e:
            logger.error(f"Error searching similar lessons: {e}")
            return []

    def delete_lesson(self, lesson_id: str) -> bool:
        """
        Delete lesson from vector database.

        Args:
            lesson_id: Lesson ID to delete

        Returns:
            True if successful
        """
        try:
            point_id = hash(lesson_id) % 2**63

            self.client.delete(
                collection_name=self.collection_name,
                points_selector=[point_id],
            )

            logger.info(f"Deleted lesson {lesson_id} from vector DB")
            return True

        except Exception as e:
            logger.error(f"Error deleting lesson {lesson_id}: {e}")
            return False

    def get_collection_info(self) -> dict:
        """
        Get collection information.

        Returns:
            Collection metadata
        """
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "name": info.name,
                "points_count": info.points_count,
                "vectors_count": info.vectors_count,
                "status": info.status,
            }
        except Exception as e:
            logger.error(f"Error getting collection info: {e}")
            return {}


# Global instance
_vector_service = None


def get_vector_service() -> VectorService:
    """Get or create global vector service instance."""
    global _vector_service
    if _vector_service is None:
        _vector_service = VectorService()
    return _vector_service
