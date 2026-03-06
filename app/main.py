from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import logging

from app.database import Base, engine
from app.routes.config import settings
# Import models so Alembic / create_all can detect them
from app.models import user, workout, sleep_log, nutrition_log, recommendation  # noqa: F401

app = FastAPI(title="Endurance Sports Coach API", version="1.0.0")
logger = logging.getLogger(__name__)

# Parse comma-separated origins from env/config.
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers (added progressively each phase)
from app.routes import auth, user as user_route, logs  # noqa: E402

app.include_router(auth.router, tags=["Auth"])
app.include_router(user_route.router, tags=["User"])
app.include_router(logs.router, tags=["Logs"])


@app.on_event("startup")
def ensure_schema_exists() -> None:
    """Create missing tables on startup without touching existing data."""
    # Creates ORM tables only if they are missing.
    Base.metadata.create_all(bind=engine)

    # Create non-ORM table used for vector context storage.
    # Some managed PostgreSQL setups may not allow CREATE EXTENSION;
    # warn and continue so core API tables still work.
    try:
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS coaching_context (
                    id SERIAL PRIMARY KEY,
                    content TEXT NOT NULL,
                    source TEXT,
                    embedding vector(1536),
                    created_at TIMESTAMPTZ DEFAULT now()
                )
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS coaching_context_embedding_idx
                ON coaching_context
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100)
            """))
    except Exception as exc:
        logger.warning("Skipping vector schema setup: %s", exc)


@app.get("/health")
def health():
    return {"status": "ok"}
