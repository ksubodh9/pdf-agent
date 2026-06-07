"""
Application settings loaded from environment variables.
Using pydantic-settings for type-safe config with .env support.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path
from functools import lru_cache


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # App
    app_name: str = "PDF Agent"
    app_version: str = "1.0.0"
    debug: bool = False

    # LLM Provider — primary provider used for all calls
    # Options: ollama | groq | huggingface | openai | anthropic | gemini
    llm_provider: str = Field(default="gemini", description="Primary LLM provider")

    # Fallback chain — comma-separated providers tried in order when primary fails
    # Example: "gemini,groq" tries Gemini first, falls back to Groq on rate-limit/auth error
    llm_fallback_chain: str = Field(default="", description="Comma-separated fallback providers")

    # API keys
    openai_api_key: str = Field(default="", description="OpenAI API key")
    gemini_api_key: str = Field(default="", description="Google Gemini API key")
    anthropic_api_key: str = Field(default="", description="Anthropic API key")
    groq_api_key: str = Field(default="", description="Groq API key (free at console.groq.com)")
    huggingface_api_key: str = Field(default="", description="HuggingFace token")

    # LLM Models
    openai_model: str = "gpt-4o-mini"
    # Comma-separated Gemini models tried in order (rate-limit fallback within Gemini)
    # Valid names: gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro
    gemini_model: str = "gemini-2.0-flash"
    gemini_models: str = Field(default="", description="Comma-separated Gemini model names to try in order")
    anthropic_model: str = "claude-3-haiku-20240307"
    groq_model: str = "llama-3.1-8b-instant"
    # Multiple Groq models tried in order on rate-limit
    groq_models: str = Field(default="", description="Comma-separated Groq model names to try in order")
    huggingface_model: str = "mistralai/Mistral-7B-Instruct-v0.3"
    # Ollama local models
    ollama_model: str = "llama3.2:latest"
    ollama_host: str = "localhost"
    ollama_port: int = 11434

    # Embeddings
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    embedding_device: str = "cpu"  # cpu | cuda

    # Storage
    upload_dir: Path = BASE_DIR / "data" / "uploads"
    vectorstore_dir: Path = BASE_DIR / "data" / "vectorstore"
    database_url: str = f"sqlite:///{BASE_DIR.as_posix()}/data/pdf_agent.db"

    # File Limits
    max_file_size_mb: int = 50
    allowed_extensions: list[str] = [".pdf"]

    # RAG / Chunking
    chunk_size: int = 1000
    chunk_overlap: int = 200
    top_k_retrieval: int = 5

    # Rate Limiting
    rate_limit_requests: int = 60
    rate_limit_window: int = 60  # seconds

    # Supabase (required for auth in production)
    # JWT secret: Supabase dashboard -> Settings -> API -> JWT Secret
    supabase_jwt_secret: str = Field(default="", description="Supabase JWT secret for token verification")
    # Service role key: used by admin endpoints to query auth.users
    # Supabase dashboard -> Settings -> API -> service_role (secret)
    supabase_service_role_key: str = Field(default="", description="Supabase service role key (admin use only)")
    supabase_url: str = Field(default="", description="https://your-project.supabase.co")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings singleton (reads .env once on first call)."""
    return Settings()
  