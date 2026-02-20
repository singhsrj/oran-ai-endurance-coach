# 🚂 Railway Deployment (Single Service)

If you prefer deploying everything on **one platform**, Railway is a good option.

## Prerequisites
- Railway account (railway.app)
- GitHub repository

## Steps

### 1. Install Railway CLI (Optional)
```bash
npm i -g @railway/cli
railway login
```

### 2. Deploy from Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `singhsrj/oran-ai-endurance-coach`
5. Railway auto-detects the configuration from `railway.json`

### 3. Add Environment Variables

In Railway dashboard, add these variables:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key
FIREWORKS_API_KEY=your-api-key
FIREWORKS_BASE_URL=https://api.fireworks.ai/inference/v1
FIREWORKS_MODEL=accounts/fireworks/models/llama-v3p1-70b-instruct
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### 4. Add PostgreSQL Database (Optional)

1. Click "New" → "Database" → "PostgreSQL"
2. Railway auto-generates `DATABASE_URL`
3. Or keep using Supabase

### 5. Update FastAPI to Serve Frontend

**File: `app/main.py`** - Add static file serving:

```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# After CORS middleware, add:
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
    
    @app.get("/", response_class=FileResponse)
    async def serve_frontend():
        return "frontend/dist/index.html"
    
    @app.get("/{full_path:path}", response_class=FileResponse)
    async def serve_spa(full_path: str):
        file_path = f"frontend/dist/{full_path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return file_path
        return "frontend/dist/index.html"
```

### 6. Deploy

```bash
git add .
git commit -m "Configure for Railway"
git push origin main
```

Railway auto-deploys on push.

### 7. Access Your App

Railway gives you: `https://your-app.up.railway.app`

## Cost

- **Starter Plan**: $5/month credit (covers hobby projects)
- **Pay-as-you-go**: Beyond free credit

## Pros & Cons

**Pros:**
- Single service deployment
- Built-in database option
- Simple configuration
- Auto-scaling

**Cons:**
- No free tier (after trial credit)
- Frontend not on CDN
- More expensive than Netlify + Render split

## When to Use Railway

- You want everything in one place
- You don't mind paying $5-20/month
- You prefer simplicity over optimization
- Your traffic is moderate

---

For most projects, **Netlify + Render** is still recommended for better performance and lower cost.
