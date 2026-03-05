from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
#supa base pass - Rss6Y5CbzC5EOHRe
# Import models so Alembic / create_all can detect them
from app.models import user, workout, sleep_log, nutrition_log, recommendation  # noqa: F401

app = FastAPI(title="Endurance Sports Coach API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers (added progressively each phase)
from app.routes import auth, user as user_route, logs  # noqa: E402

app.include_router(auth.router, tags=["Auth"])
app.include_router(user_route.router, tags=["User"])
app.include_router(logs.router, tags=["Logs"])


@app.get("/health")
def health():
    return {"status": "ok"}
