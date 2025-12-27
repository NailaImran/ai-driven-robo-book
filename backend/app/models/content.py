"""Content-related models: chat history, content metadata, technical glossary."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class ChatMessage(Base):
    """Chat message logs for RAG chatbot conversations."""

    __tablename__ = "chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # Message content
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)

    # RAG metadata
    retrieved_chunks = Column(JSON, nullable=True)  # Array of {chunk_id, score, content}
    response_time_ms = Column(Integer, nullable=True)
    feedback_score = Column(Integer, nullable=True)  # 1-5 rating, nullable

    # Language support
    language = Column(String(5), default="en", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="chat_messages")

    def __repr__(self) -> str:
        return f"<ChatMessage(id={self.id}, user_id={self.user_id}, language={self.language})>"


class ContentMetadata(Base):
    """Content versioning and embedding status tracking."""

    __tablename__ = "content_metadata"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # Content identification
    page_path = Column(String(500), unique=True, nullable=False, index=True)
    content_hash = Column(String(64), nullable=False, index=True)  # SHA-256 hash

    # Embedding status
    last_embedded_at = Column(DateTime, nullable=True)
    chunk_count = Column(Integer, default=0, nullable=False)

    # Content organization
    module_name = Column(String(255), nullable=True)
    week_number = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ContentMetadata(page_path='{self.page_path}', hash='{self.content_hash[:8]}...')>"


class TechnicalTerm(Base):
    """English-Urdu technical glossary for translation consistency."""

    __tablename__ = "technical_terms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # Glossary entries
    english_term = Column(String(255), unique=True, nullable=False, index=True)
    urdu_term = Column(String(255), nullable=False)
    context = Column(Text, nullable=True)  # Usage notes
    category = Column(String(100), nullable=True, index=True)  # e.g., "robotics", "sensors"

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<TechnicalTerm(en='{self.english_term}', ur='{self.urdu_term}', category='{self.category}')>"
