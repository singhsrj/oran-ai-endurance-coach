# 🚀 Deployment Guide - Netlify + Render

## Overview

This guide walks you through deploying the AI-Powered Endurance Coach using:
- **Netlify** → Frontend (React + Vite)
- **Render** → Backend (FastAPI)
- **Supabase** → Database (PostgreSQL) - already configured

---

## 🎯 Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Netlify   │─────▶│   Render    │─────▶│  Supabase   │
│  (Frontend) │ HTTPS │  (Backend)  │ SQL  │ (Database)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 📦 Part 1: Deploy Backend on Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `singhsrj/oran-ai-endurance-coach`
3. Configure the service:

**Basic Settings:**
```
Name: oran-ai-backend
Runtime: Python 3
Region: Your nearest region (e.g., Oregon, Frankfurt)
Branch: main
Root Directory: (leave blank)
```

**Build Settings:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
- Free (for testing) - sleeps after 15 mins of inactivity
- Starter ($7/month) - always on, better for production

### Step 3: Configure Environment Variables

Add these in the Render dashboard under **"Environment"**:

```bash
# Database (use your Supabase connection string)
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
SECRET_KEY=your-secret-key-here-generate-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Fireworks AI
FIREWORKS_API_KEY=your-fireworks-api-key
FIREWORKS_BASE_URL=https://api.fireworks.ai/inference/v1
FIREWORKS_MODEL=accounts/fireworks/models/llama-v3p1-70b-instruct
```

**Generate SECRET_KEY:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Your backend URL will be: `https://oran-ai-backend.onrender.com`

### Step 5: Test Backend

Visit: `https://oran-ai-backend.onrender.com/docs`

You should see the FastAPI Swagger documentation.

---

## 🌐 Part 2: Deploy Frontend on Netlify

### Step 1: Update API Base URL

Update the frontend to use your Render backend URL:

**File: `frontend/src/api/axios.js`**

Change:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

To:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://oran-ai-backend.onrender.com';
```

### Step 2: Create Netlify Configuration

Already exists in the project (if not, create it).

### Step 3: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### Step 4: Deploy Frontend
1. Click **"Add new site"** → **"Import an existing project"**
2. Connect GitHub and select: `singhsrj/oran-ai-endurance-coach`
3. Configure build settings:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### Step 5: Add Environment Variable (Optional)

If you want to override the API URL:
```
VITE_API_URL=https://oran-ai-backend.onrender.com
```

### Step 6: Deploy

1. Click **"Deploy site"**
2. Wait for build (2-3 minutes)
3. Your frontend URL: `https://random-name-123.netlify.app`

### Step 7: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Add custom domain: `oran-ai.yourdomain.com`
3. Update DNS records as instructed

---

## 🔧 Part 3: Configure CORS

Update backend to allow requests from Netlify:

**File: `app/main.py`**

In the CORS middleware, add your Netlify URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-app-name.netlify.app",  # Add this
        "https://yourdomain.com"  # If using custom domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push - Render will auto-deploy.

---

## ✅ Testing Deployment

1. **Test Backend:**
   - Visit: `https://oran-ai-backend.onrender.com/docs`
   - Try the `/metrics` endpoint

2. **Test Frontend:**
   - Visit: `https://your-app.netlify.app`
   - Sign up for an account
   - Log in and test features

3. **Test Full Flow:**
   - Log a workout
   - Check dashboard
   - Request AI recommendation

---

## 💰 Cost Breakdown

### Free Tier (Best for Development)
- **Netlify**: Free (100GB bandwidth, 300 build minutes/month)
- **Render**: Free (sleeps after 15 mins inactivity)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Fireworks AI**: Pay-per-use ($0.20/million tokens)

**Total: ~$0-5/month** depending on AI usage

### Production Tier
- **Netlify**: Free or Pro ($19/month for teams)
- **Render**: Starter ($7/month) or Standard ($25/month)
- **Supabase**: Pro ($25/month) for better performance
- **Fireworks AI**: ~$10-50/month depending on users

**Total: ~$42-100/month**

---

## 🔄 Continuous Deployment

Both services auto-deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render and Netlify automatically deploy
```

---

## 🚨 Troubleshooting

### Backend Issues

**503 Service Unavailable:**
- Render free tier sleeps after inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to Starter plan for always-on

**Database Connection Errors:**
- Check DATABASE_URL is correct
- Ensure Supabase database is active
- Check IP allowlist (Supabase allows all by default)

**Module Import Errors:**
- Verify `requirements.txt` is complete
- Check build logs on Render dashboard

### Frontend Issues

**API Requests Failing:**
- Check CORS settings in backend
- Verify API_BASE_URL in `axios.js`
- Check browser console for errors

**Build Failures:**
- Check Node version compatibility
- Run `npm install` locally first
- Review Netlify build logs

**404 on Page Refresh:**
- Add `netlify.toml` with redirect rules
- Already configured in project

### CORS Errors

**"Access-Control-Allow-Origin" error:**
```python
# Add your Netlify domain to CORS origins
allow_origins=[
    "https://your-app.netlify.app"
]
```

---

## 🎯 Alternative: Deploy Everything on Render

You can deploy both frontend and backend on Render:

### Backend (Web Service)
Same as above

### Frontend (Static Site)
1. Create **"Static Site"** on Render
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`

**Pros:** Single platform, simpler management  
**Cons:** Less optimal for static sites, no free tier for static sites

---

## 🐳 Alternative: Single Service with Docker

**Railway, Fly.io, or DigitalOcean App Platform** can run everything in one container:

1. Create multi-stage Dockerfile:
```dockerfile
# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Run backend + serve frontend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app/ ./app/
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Serve frontend from backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. Update FastAPI to serve frontend files
3. Deploy to Railway/Fly.io/DigitalOcean

**Best for:** Small projects, simplicity  
**Drawbacks:** No CDN for frontend, higher costs

---

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

## ✨ Production Checklist

Before going live:

- [ ] Set strong `SECRET_KEY` (not default)
- [ ] Use production database (not dev)
- [ ] Enable HTTPS everywhere
- [ ] Set up database backups (Supabase auto-backups)
- [ ] Configure custom domain
- [ ] Set up monitoring (Render dashboard, Sentry)
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all forms
- [ ] Error tracking (Rollbar, Sentry)
- [ ] Analytics (Google Analytics, Plausible)

---

## 🎉 You're Live!

Your app is now deployed and accessible globally:
- Frontend: Fast, CDN-distributed
- Backend: Auto-scaling, secure
- Database: Managed, backed up

**Next Steps:**
- Share with beta users
- Monitor performance
- Iterate based on feedback
- Scale as needed

---

**Need help?** Open an issue on GitHub or check service-specific documentation.
