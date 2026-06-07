"""
FastAPI application entry point.
"""

import os as _os
import threading
import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config.settings import get_settings
from app.database.base import init_db
from app.api.routes import router
from app.api.admin import router as admin_router

settings = get_settings()
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered PDF agent with RAG, classification, summarization, and Q&A.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
_CORS_ORIGINS = [
    "http://localhost:8501",
    "http://127.0.0.1:8501",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
_frontend_url = _os.getenv("FRONTEND_URL")
if _frontend_url:
    _CORS_ORIGINS.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.3f}s"
    return response


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.method} {request.url}: {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal server error", "detail": str(exc)})


@app.on_event("startup")
async def startup():
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"LLM Provider : {settings.llm_provider}")
    logger.info(f"Embedding    : {settings.embedding_model}")

    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.vectorstore_dir.mkdir(parents=True, exist_ok=True)

    from pathlib import Path
    import re
    db_path_match = re.match(r"sqlite:///(.+)", settings.database_url)
    if db_path_match:
        db_path = Path(db_path_match.group(1))
        db_path.parent.mkdir(parents=True, exist_ok=True)
        for suffix in ("-journal", "-wal", "-shm"):
            stale = db_path.parent / (db_path.name + suffix)
            if stale.exists():
                try:
                    stale.unlink()
                    logger.warning(f"Removed stale SQLite lock file: {stale.name}")
                except OSError as e:
                    logger.warning(f"Could not remove {stale.name}: {e}")

    init_db()
    logger.info("Database initialised.")

    def _warm_embeddings():
        try:
            from app.rag.embeddings import get_embedding_model
            get_embedding_model().embed_query("warmup")
            logger.info("Embedding model pre-loaded and ready.")
        except Exception as e:
            logger.warning(f"Embedding warmup skipped: {e}")

    threading.Thread(target=_warm_embeddings, daemon=True).start()

    if settings.llm_provider == "ollama":
        from app.utils.ollama_utils import is_ollama_running, get_ollama_base_url, is_model_available
        base_url = get_ollama_base_url(settings.ollama_host, settings.ollama_port)
        if is_ollama_running(base_url):
            logger.info(f"Ollama is reachable at {base_url}")
            if is_model_available(base_url, settings.ollama_model):
                logger.info(f"Model '{settings.ollama_model}' is available.")
            else:
                logger.warning(f"Model '{settings.ollama_model}' not found. Run: ollama pull {settings.ollama_model}")
        else:
            logger.warning(f"Ollama not reachable at {base_url}. Make sure Ollama is running.")

    logger.info("PDF Agent is ready.")


app.include_router(router, prefix="/api/v1", tags=["PDF Agent"])
app.include_router(admin_router, prefix="/api/v1", tags=["Admin"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.app_version}
