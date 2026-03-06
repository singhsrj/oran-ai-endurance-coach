# 🏃 AI-Powered Endurance Coach - Complete Setup Guide

## ✅ What's Built

A full-stack application with:
- **FastAPI Backend** - REST API with JWT authentication
- **React + Vite Frontend** - Modern, responsive UI
- **Supabase Database** - Cloud PostgreSQL
- **Fireworks AI** - LangGraph-powered workout recommendations
- **Training Metrics Engine** - Fitness-fatigue mathematical model

---

## 🚀 Running the Application

### Backend (FastAPI)

**Terminal 1:**
```powershell
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Start the API server
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### Frontend (React + Vite)

**Terminal 2:**
```powershell
# Navigate to frontend directory
cd frontend

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📊 Current Status

### ✅ Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signup` | POST | Register new user |
| `/login` | POST | Login and get JWT token |
| `/me` | GET | Get/update user profile |
| `/log-workout` | POST | Log workout with training load calculation |
| `/log-sleep` | POST | Log sleep data |
| `/log-nutrition` | POST | Log nutrition data |
| `/metrics` | GET | Get CTL/ATL/TSB/Recovery metrics |
| `/recommend` | POST | Get AI-powered workout recommendation |
| `/dashboard` | GET | Get all dashboard data in one call |

### ✅ Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User authentication |
| `/signup` | Signup | New user registration |
| `/dashboard` | Dashboard | Main dashboard with metrics & charts |
| `/log` | LogActivity | Log workouts, sleep, nutrition |

---

## 📁 Project Structure

```
AI-Powered Endurance Coach/
├── app/                          # Backend (FastAPI)
│   ├── main.py                  # FastAPI app entry point
│   ├── database.py              # SQLAlchemy setup
│   ├── models/                  # Database models
│   │   ├── user.py
│   │   ├── workout.py
│   │   ├── sleep_log.py
│   │   ├── nutrition_log.py
│   │   └── recommendation.py
│   ├── routes/                  # API endpoints
│   │   ├── auth.py             # Authentication (/signup, /login)
│   │   ├── auth_utils.py       # JWT & password utilities
│   │   ├── user.py             # User profile (/me)
│   │   ├── logs.py             # Logging & dashboard endpoints
│   │   ├── schemas.py          # Pydantic models
│   │   └── config.py           # Environment settings
│   └── services/                # Business logic
│       ├── training_engine.py  # CTL/ATL/TSB calculations
│       └── ai_coach.py         # LangGraph AI workflow
├── frontend/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/                # API client
│   │   │   ├── axios.js
│   │   │   ├── auth.js
│   │   │   └── endurance.js
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── LogActivity.jsx
│   │   ├── App.jsx             # Main app with routing
│   │   └── main.jsx            # Entry point
│   └── package.json
├── .env                          # Backend environment variables
└── requirements.txt              # Python dependencies
```

---

## 🔑 Environment Variables

### Backend (.env in root)
```env
DATABASE_URL=postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>?sslmode=require
FIREWORKS_API_KEY=your-fireworks-api-key
SECRET_KEY=your-secret-key-here
```

### Frontend (frontend/.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧪 Test the Application

### 1. Test Backend Health
```powershell
Invoke-WebRequest -Uri http://localhost:8000/health
```

### 2. Test User Signup
```powershell
$body = @{
  email = "test@example.com"
  password = "password123"
  name = "Test Runner"
  sport = "running"
  experience_level = "intermediate"
  goal = "Run a marathon"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8000/signup -Method POST -Body $body -ContentType "application/json"
```

### 3. Test Login & Dashboard
```powershell
# Login
$loginBody = @{email="test@example.com"; password="password123"} | ConvertTo-Json
$login = Invoke-RestMethod -Uri http://localhost:8000/login -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.access_token

# Get Dashboard
$headers = @{Authorization="Bearer $token"}
$dashboard = Invoke-RestMethod -Uri http://localhost:8000/dashboard -Method GET -Headers $headers
$dashboard | ConvertTo-Json -Depth 10
```

### 4. Access Frontend
Open browser: **http://localhost:5173**

1. Click "Sign Up" → Create account
2. Login with credentials
3. View Dashboard → See metrics, charts
4. Click "Log Activity" → Add workout
5. Click "Get New Recommendation" → AI generates workout plan

---

## 📊 Training Metrics Explained

### CTL (Chronic Training Load)
- **What**: 42-day exponential moving average of training load
- **Represents**: Overall fitness level
- **Range**: Higher is fitter (typically 30-100 for recreational athletes)

### ATL (Acute Training Load)
- **What**: 7-day exponential moving average of training load
- **Represents**: Recent training stress and fatigue
- **Range**: Fluctuates with recent workouts (20-150+)

### TSB (Training Stress Balance)
- **What**: CTL - ATL (Fitness minus Fatigue)
- **Represents**: Form and readiness to perform
- **Interpretation**:
  - `TSB < -30`: Overreaching (high injury risk)
  - `-30 to -10`: Optimal training zone (building fitness)
  - `-10 to +5`: Maintaining fitness
  - `+5 to +25`: Peak form (race ready)
  - `> +25`: Detraining (need more training load)

### Recovery Score
- **What**: Combination of sleep quality (50%) and training stress (50%)
- **Range**: 0-100% (higher is better)
- **Thresholds**:
  - `< 50%`: Low recovery
  - `50-70%`: Moderate recovery
  - `> 70%`: Good recovery

---

## 🤖 AI Recommendation Workflow (LangGraph)

```
User requests recommendation
        ↓
[1. Analyze] - AI examines training metrics, recovery, experience
        ↓
[2. Recommend] - AI generates workout (type, duration, intensity)
        ↓
[3. Validate] - Safety check (no injuries, progress not too aggressive)
        ↓
[4. Finalize] - Save to database & return to user
```

**Model**: Fireworks GPT-OSS-120B  
**Context**: CTL, ATL, TSB, recovery score, user profile, recent workouts

---

## 🎯 Next Steps (Future Enhancements)

### Phase 8: Testing
- Write pytest unit tests for training engine
- Integration tests for API endpoints
- Frontend tests with React Testing Library
- Mock Fireworks AI calls for consistent testing

### Phase 10: Deployment
- Deploy backend to Railway/Render/Fly.io
- Deploy frontend to Vercel/Netlify
- Set up CI/CD pipeline with GitHub Actions
- Configure production environment variables

### Phase 11: Advanced Features
- Email notifications for workout reminders
- Social features (share workouts with friends)
- Export training data to CSV
- Integration with Strava/Garmin
- Mobile app with React Native

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Reinstall dependencies
pip install -r requirements.txt

# Check database connection
python -c "from app.database import engine; print(engine)"
```

### Frontend build errors
```powershell
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

### CORS errors
Make sure backend has CORS middleware enabled in `app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5173"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 API Example: Full User Flow

```powershell
# 1. Signup
$signup = @{
  email = "runner@example.com"
  password = "securepass"
  name = "Marathon Runner"
  age = 28
  weight = 70
  height = 175
  sport = "running"
  experience_level = "intermediate"
  goal = "Break 3:30 marathon"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8000/signup -Method POST -Body $signup -ContentType "application/json"

# 2. Login
$login = @{email="runner@example.com"; password="securepass"} | ConvertTo-Json
$token = (Invoke-RestMethod -Uri http://localhost:8000/login -Method POST -Body $login -ContentType "application/json").access_token
$headers = @{Authorization="Bearer $token"}

# 3. Log a workout
$workout = @{
  date = "2026-02-19"
  workout_type = "tempo"
  duration = 60
  distance = 12.5
  avg_hr = 165
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8000/log-workout -Method POST -Body $workout -Headers $headers -ContentType "application/json"

# 4. Get AI recommendation
$recommendation = Invoke-RestMethod -Uri http://localhost:8000/recommend -Method POST -Headers $headers
$recommendation | ConvertTo-Json -Depth 10

# 5. View dashboard
$dashboard = Invoke-RestMethod -Uri http://localhost:8000/dashboard -Method GET -Headers $headers
$dashboard.metrics
```

---

## ✨ Features Showcase

### Dashboard View
- **4 metric cards**: Fitness, Fatigue, Form, Recovery
- **Line chart**: Training load over last 10 workouts
- **AI recommendation card**: Highlighted workout suggestion with warnings
- **Recent activity list**: Last 5 workouts with details

### Logging Forms
- **Workout tab**: Choose type (easy/tempo/interval/long/race), duration, distance, HR
- **Sleep tab**: Hours + quality slider (1-10)
- **Nutrition tab**: Calories, protein, carbs, fats

### Intelligent Training Load
- **Easy run**: Base load = duration
- **Tempo run**: 1.5x multiplier + HR adjustment
- **Intervals**: 1.8x multiplier + higher HR factor
- **Long run**: 1.3x multiplier
- **Race**: 2.0x multiplier

---

**🎉 The full-stack AI-powered endurance coach is ready!**

Backend: http://localhost:8000  
Frontend: http://localhost:5173  
Docs: http://localhost:8000/docs  
