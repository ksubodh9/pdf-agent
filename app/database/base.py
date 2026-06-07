"""
SQLAlchemy engine, session factory, and declarative base.
Supports both SQLite (local dev) and PostgreSQL (Supabase production).
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from typing import Generator

from app.config.settings import get_settings

settings = get_settings()
_is_sqlite = settings.database_url.startswith("sqlite")


class Base(DeclarativeBase):
    pass


if _is_sqlite:
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False, "timeout": 30},
        echo=settings.debug,
    )

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragmas(dbapi_conn, _record):
        """
        MEMORY journal mode: SQLite never writes/deletes journal files to disk.
        Eliminates SQLITE_IOERR_DELETE (code 2570) on Docker WSL2 bind-mounts.
        """
        cur = dbapi_conn.cursor()
        cur.execute("PRAGMA journal_mode=MEMORY")
        cur.execute("PRAGMA synchronous=NORMAL")
        cur.execute("PRAGMA foreign_keys=ON")
        cur.close()

else:
    # PostgreSQL (Supabase) — use connection pooling
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,       # reconnect on stale connections
        pool_size=5,
        max_overflow=10,
        echo=settings.debug,
    )


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Create all tables. Call once at startup."""
    from app.models import document, usage   # noqa: F401 — registers models
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency — yields a DB session and closes on exit."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
