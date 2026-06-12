"""
SQLAlchemy ORM models for Documents and Chat History.
"""

from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True, index=True)   # Supabase auth user UUID
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    page_count = Column(Integer, default=0)

    # Cached extracted text
    full_text = Column(Text, nullable=True)

    # Classification
    document_type = Column(String(100), nullable=True)
    classification_confidence = Column(Float, nullable=True)

    # Processing state: uploaded | processing | ready | error
    status = Column(String(50), default="uploaded")
    error_message = Column(Text, nullable=True)

    # AI-generated content
    short_summary = Column(Text, nullable=True)
    detailed_summary = Column(Text, nullable=True)
    topics = Column(JSON, nullable=True)
    keywords = Column(JSON, nullable=True)
    entities = Column(JSON, nullable=True)
    suggested_questions = Column(JSON, nullable=True)

    # Metadata
    doc_metadata = Column(JSON, nullable=True)

    # Table extraction
    has_tables = Column(Boolean, default=False)
    table_count = Column(Integer, default=0)
    tables = Column(JSON, nullable=True)

    # ChromaDB collection
    collection_name = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    chat_messages = relationship("ChatMessage", back_populates="document", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Document id={self.id} filename={self.filename} type={self.document_type}>"


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    role = Column(String(20), nullable=False)   # user | assistant
    content = Column(Text, nullable=False)
    citations = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="chat_messages")

    def __repr__(self) -> str:
        return f"<ChatMessage id={self.id} role={self.role} doc={self.document_id}>"
