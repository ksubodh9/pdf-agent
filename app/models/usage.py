"""
UsageEvent — lightweight audit/analytics table.

One row per API feature call, keyed by user_id + event_type.
The admin dashboard aggregates these to show per-user feature usage.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey

from app.database.base import Base


class UsageEvent(Base):
    __tablename__ = "usage_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)   # Supabase user UUID
    document_id = Column(
        String(36),
        ForeignKey("documents.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    # event_type values: upload | classify | summarize | metadata | chat | chat_multi | compare | tables
    event_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def __repr__(self):
        return f"<UsageEvent user={self.user_id} type={self.event_type}>"
