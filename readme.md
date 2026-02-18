# Oran AI

**AI-Powered Endurance Training Coach with Holistic Athlete Management**

---

## 🎯 Problem Statement

Endurance athletes face a critical challenge: **balancing training intensity with adequate recovery to optimize performance while avoiding injury and burnout**. Traditional training approaches often focus solely on workout data, ignoring crucial factors like sleep quality, nutrition, and cumulative fatigue. This one-dimensional approach leads to:

- **Overtraining and injuries** due to inadequate recovery tracking
- **Suboptimal performance** from not accounting for sleep and nutrition
- **Inconsistent progress** without scientific load management
- **Guesswork-based training decisions** instead of data-driven recommendations
- **Lack of personalized coaching** that adapts to individual recovery patterns

Athletes need a comprehensive system that considers their entire physiological state—not just miles run or hours trained—to make intelligent training decisions.

---

## 🏃 Current Solutions & Their Limitations

### Strava
- **What it does well**: Tracks workouts, social features, segment competitions
- **Critical gaps**:
  - ❌ No sleep tracking or recovery metrics
  - ❌ No nutrition logging
  - ❌ No AI-powered workout recommendations
  - ❌ No fitness-fatigue modeling (CTL/ATL/TSB)
  - ❌ Only accounts for workouts logged within their app
  - ❌ Provides data visualization but no actionable training advice

### TrainingPeaks
- **What it does well**: Advanced training load metrics, coach collaboration
- **Limitations**:
  - ❌ Expensive ($130+/year for premium features)
  - ❌ Complex interface not suitable for recreational athletes
  - ❌ Limited AI capabilities
  - ❌ Sleep and nutrition tracking are rudimentary

### Garmin/Fitbit
- **What it does well**: Automatic workout and sleep tracking via wearables
- **Limitations**:
  - ❌ Proprietary algorithms (black box)
  - ❌ Generic recommendations not based on individual training history
  - ❌ Limited nutrition integration
  - ❌ No coach-athlete workflow support

---

## 💡 Introducing Oran AI

**Oran AI** is a next-generation endurance training platform that takes a **holistic, scientifically-grounded approach** to athlete development. Unlike existing solutions, Oran AI:

✅ **Considers the complete picture**: Workouts + Sleep + Nutrition  
✅ **Uses proven sports science**: Implements the Fitness-Fatigue model (Banister, 1975) with CTL/ATL/TSB metrics  
✅ **Provides AI-powered coaching**: LangGraph-based recommendation engine trained on exercise physiology literature  
✅ **Learns from YOUR data**: Every logged workout, sleep session, and meal informs future recommendations  
✅ **Adapts to your recovery**: Real-time adjustments based on sleep quality and cumulative training stress  
✅ **Accessible and affordable**: Clean, intuitive interface for athletes of all levels  

Oran AI doesn't just track your training—it **coaches you intelligently** by understanding when to push harder and when to prioritize recovery.

---

## 🌟 Key Features

### 1. Scientifically-Backed Training Metrics

Implements the **Fitness-Fatigue Model** based on peer-reviewed sports science:

- **CTL (Chronic Training Load)**: 42-day exponential moving average representing long-term fitness
- **ATL (Acute Training Load)**: 7-day exponential moving average representing short-term fatigue
- **TSB (Training Stress Balance)**: CTL - ATL, indicating form and readiness to perform
- **Recovery Score**: Combines sleep quality (50%) and training stress (50%) for holistic recovery assessment

**References**:
- Banister, E. W. (1975). "Modeling Elite Athletic Performance"
- Busso, T. (2003). "Variable dose-response relationship between exercise training and performance"
- Coggan, A. R. (2019). "Training and Racing Using a Power Meter"

### 2. AI-Powered Workout Recommendations

Our **LangGraph-based AI coach** analyzes:
- Current fitness and fatigue levels
- Recent training history (volume, intensity, frequency)
- Sleep quality and duration trends
- Nutrition adequacy
- User's experience level and goals
- Training phase (base building, peak, taper, recovery)

The AI generates **personalized workout prescriptions** including:
- Workout type (easy/tempo/interval/long/race)
- Duration and intensity zones
- Detailed rationale based on your physiological state
- Safety warnings to prevent overtraining
- Progressive overload scheduling

### 3. Comprehensive Activity Logging

**Workouts**:
- Type, duration, distance
- Average heart rate
- Automatic training load calculation with intensity multipliers

**Sleep**:
- Hours of sleep
- Quality score (1-10 subjective rating)
- Integrated into recovery calculations

**Nutrition**:
- Daily calorie intake
- Macronutrient breakdown (protein, carbs, fats)
- Future: Meal timing and pre/post-workout nutrition optimization

### 4. Intelligent Training Load Calculation

**Workout intensity multipliers based on training zone science**:
- Easy runs: 1.0x (aerobic base building)
- Tempo runs: 1.5x (lactate threshold training)
- Interval workouts: 1.8x (VO2max development)
- Long runs: 1.3x (aerobic endurance)
- Race efforts: 2.0x (maximum stress)

**Heart rate adjustments**:
- Low HR (<140 bpm): -10% training load
- Moderate HR (140-165 bpm): Baseline load
- High HR (165-180 bpm): +20% training load
- Maximum HR (>180 bpm): +35% training load

### 5. Real-Time Dashboard

Single-page view showing:
- Current fitness/fatigue/form metrics
- Training load trend chart (last 30 days)
- Latest AI recommendation with reasoning
- Recent workout history
- Recovery status with actionable insights

### 6. Complete Training History Storage

**Every data point is stored and analyzed**:
- Workout history with calculated training loads
- Sleep patterns over time
- Nutrition trends
- AI recommendation archive with outcomes

This historical data enables the AI to:
- Detect patterns in your training response
- Identify optimal recovery windows
- Predict injury risk from abnormal load spikes
- Personalize recommendations based on what works for YOU

### 7. Future Features (Roadmap)

**Coach Integration** (Coming Soon):
- Coaches can upload training plans for athletes
- **Drag-and-drop calendar interface** for easy plan creation
- Athletes can sync coach-created workouts to their calendar
- Oran AI will adjust recommendations to align with coach's periodization
- Automated plan modifications based on athlete recovery data
- Coach can review athlete compliance and provide feedback

**Advanced Analytics**:
- Injury risk prediction using machine learning
- Race performance forecasting
- Optimal taper protocols
- Training plan comparison (A/B testing)

**Wearable Integration**:
- Automatic workout import from Garmin, Polar, Wahoo
- Real-time heart rate variability (HRV) monitoring
- Sleep tracking from wearables

**Social Features**:
- Training group challenges
- Share workouts and PRs
- Find training partners by location and pace

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with async support
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and schema management
- **Supabase (PostgreSQL)** - Cloud-hosted database
- **JWT (python-jose)** - Secure authentication tokens
- **bcrypt** - Password hashing
- **Uvicorn** - ASGI server

### AI & Machine Learning
- **Fireworks AI** - LLM inference (GPT-OSS-120B model)
- **LangGraph** - Multi-agent workflow orchestration
- **LangChain** - LLM integration framework
- **OpenAI SDK** - Compatible API client

### Frontend
- **React 18** - Component-based UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization and charting
- **Context API** - State management

### DevOps & Infrastructure
- **Git & GitHub** - Version control
- **Python Virtual Environment** - Dependency isolation
- **npm** - Package management for frontend
- **PowerShell** - Development automation scripts

### Database Schema
- **Users** - Profile and authentication data
- **Workouts** - Exercise logs with training load scores
- **Sleep Logs** - Sleep duration and quality ratings
- **Nutrition Logs** - Daily calorie and macro intake
- **Recommendations** - AI-generated workout prescriptions with reasoning

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Supabase account (or PostgreSQL database)
- Fireworks AI API key

### Backend Setup

```powershell
# Clone the repository
git clone <repository-url>
cd "AI-Powered Endurance Coach"

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create .env file with:
# DATABASE_URL=postgresql://...
# FIREWORKS_API_KEY=your-key
# SECRET_KEY=your-secret

# Create database tables
python -c "from app.models import *; from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Start the API server
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**

### Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📖 API Documentation

Once the backend is running, access interactive API documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signup` | POST | Register new user account |
| `/login` | POST | Authenticate and receive JWT token |
| `/me` | GET/PUT | Get or update user profile |
| `/log-workout` | POST | Log workout with automatic training load calculation |
| `/log-sleep` | POST | Log sleep data for recovery tracking |
| `/log-nutrition` | POST | Log daily nutrition intake |
| `/metrics` | GET | Get current CTL/ATL/TSB and recovery metrics |
| `/recommend` | POST | Generate AI-powered workout recommendation |
| `/dashboard` | GET | Get complete dashboard data in single request |

---

## 📊 How It Works

### 1. User Logs Activities
Athletes record workouts, sleep, and nutrition through the intuitive web interface.

### 2. Training Load Calculation
Oran AI calculates training load for each workout using:
```
Training Load = Duration × Intensity Multiplier × Heart Rate Factor
```

### 3. Fitness-Fatigue Modeling
The system continuously updates:
- **CTL** (Chronic Training Load): 42-day exponential moving average
- **ATL** (Acute Training Load): 7-day exponential moving average
- **TSB** (Training Stress Balance): CTL - ATL

### 4. Recovery Assessment
Recovery score is calculated from:
```
Recovery Score = (Sleep Quality × 0.5) + (Training Stress Factor × 0.5)
```

### 5. AI Recommendation Generator
LangGraph workflow processes:
1. **Analyze**: Examine current metrics, trends, and user profile
2. **Recommend**: Generate workout prescription based on analysis
3. **Validate**: Safety check to prevent injury risk
4. **Finalize**: Save recommendation and return to user

### 6. Adaptive Learning
Every logged activity refines the AI's understanding of the athlete's response to training, enabling increasingly personalized recommendations over time.

---

## 🧪 Example Usage

```powershell
# 1. Create account
POST /signup
{
  "email": "athlete@example.com",
  "password": "securepass",
  "name": "Alex Runner",
  "sport": "running",
  "experience_level": "intermediate",
  "goal": "Run a sub-4 hour marathon"
}

# 2. Log a workout
POST /log-workout (with JWT token)
{
  "date": "2026-02-19",
  "workout_type": "tempo",
  "duration": 60,
  "distance": 12.5,
  "avg_hr": 165
}

# 3. Get AI recommendation
POST /recommend (with JWT token)
# Returns personalized workout based on current fitness/fatigue/recovery

# 4. View dashboard
GET /dashboard (with JWT token)
# Returns complete overview: metrics, charts, recommendations, history
```

---

## 🔬 Scientific Foundation

Oran AI is built on validated sports science principles:

### Fitness-Fatigue Model (Banister Model)
- **Fitness**: Slowly acquired (42-day time constant), slowly lost
- **Fatigue**: Quickly acquired (7-day time constant), quickly lost
- **Form**: The difference between fitness and fatigue
- **Supercompensation**: Strategic fatigue reduction reveals peak fitness

### Training Stress Score (TSS) Methodology
- **Intensity Factor (IF)**: Workout intensity relative to threshold
- **Duration**: Time under training stress
- **Training Load**: IF² × Duration (normalized for comparison)

### Recovery Science
- Sleep quality is the #1 predictor of training adaptation (Halson, 2014)
- Inadequate recovery leads to non-functional overreaching and injury
- Monitoring HRV, sleep, and subjective wellness prevents overtraining

### Periodization Principles
- Base building: High volume, low intensity (aerobic development)
- Build phase: Increased intensity, maintained volume (lactate threshold)
- Peak phase: High intensity intervals (VO2max, neuromuscular power)
- Taper: Reduced volume, maintained intensity (supercompensation)

---

## 🤝 Contributing

Contributions are welcome! Areas for development:
- Additional sports support (swimming, cycling, triathlon)
- Coach dashboard and athlete management
- Mobile app (React Native)
- Wearable device integrations
- Advanced analytics and visualizations

---

## 📄 License

This project is licensed under the MIT License.

---

---

## 📧 Contact

For questions, feedback, or collaboration opportunities, please open an issue on GitHub.

---

**Oran AI - Train Smarter, Perform Better, Stay Healthy** 🏃‍♂️💪🧠
