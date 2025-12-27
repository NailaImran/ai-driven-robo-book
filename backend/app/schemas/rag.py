"""Pydantic schemas for RAG chatbot endpoints."""

from typing import List, Optional
from pydantic import BaseModel, Field


class Source(BaseModel):
    """Source document information."""

    title: str = Field(..., description="Title of the source document")
    url: str = Field(..., description="URL to the source document")
    excerpt: str = Field(..., description="Relevant excerpt from the source")
    score: float = Field(..., description="Relevance score (0-1)")


class RAGQueryRequest(BaseModel):
    """Request schema for RAG query endpoint."""

    query: str = Field(..., min_length=1, max_length=1000, description="User question")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context")
    max_sources: int = Field(default=3, ge=1, le=10, description="Maximum number of sources to return")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="LLM temperature")


class RAGQueryResponse(BaseModel):
    """Response schema for RAG query endpoint."""

    answer: str = Field(..., description="Generated answer")
    sources: List[Source] = Field(default_factory=list, description="Source documents used")
    conversation_id: str = Field(..., description="Conversation ID")
    tokens_used: Optional[int] = Field(None, description="Total tokens used")


class RAGSelectionRequest(BaseModel):
    """Request schema for selected text query endpoint."""

    selected_text: str = Field(..., min_length=1, max_length=2000, description="Selected text from page")
    question: str = Field(..., min_length=1, max_length=500, description="Question about the selection")
    page_url: Optional[str] = Field(None, description="URL of the page")


class ChatMessage(BaseModel):
    """Chat message schema."""

    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class ConversationHistory(BaseModel):
    """Conversation history schema."""

    conversation_id: str = Field(..., description="Unique conversation ID")
    messages: List[ChatMessage] = Field(default_factory=list, description="Message history")
    created_at: str = Field(..., description="ISO timestamp of creation")
    updated_at: str = Field(..., description="ISO timestamp of last update")
