# AI-Powered Endurance Coach - Frontend

React + Vite frontend for the AI-Powered Endurance Coach application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

## 🏗️ Project Structure

```
src/
├── api/                    # API client configuration
│   ├── axios.js           # Axios instance with auth interceptors
│   ├── auth.js            # Authentication API calls
│   └── endurance.js       # Workout/sleep/nutrition API calls
├── contexts/              
│   └── AuthContext.jsx    # Authentication state management
├── pages/                 # Page components
│   ├── Login.jsx          # Login page
│   ├── Signup.jsx         # Registration page
│   ├── Dashboard.jsx      # Main dashboard with metrics & charts
│   ├── LogActivity.jsx    # Workout/sleep/nutrition logging
│   ├── Auth.css           # Styles for auth pages
│   ├── Dashboard.css      # Styles for dashboard
│   └── LogActivity.css    # Styles for logging forms
├── App.jsx                # Main app with routing
├── App.css                # Global app styles
├── index.css              # Base CSS reset
└── main.jsx               # Entry point
```

## 🔑 Features

### Authentication
- **Sign up** with profile information (sport, experience level, goals)
- **Login** with email/password
- **JWT token** stored in localStorage
- **Auto-redirect** based on auth state

### Dashboard
- **Training Metrics** cards showing:
  - CTL (Chronic Training Load / Fitness)
  - ATL (Acute Training Load / Fatigue)
  - TSB (Training Stress Balance / Form)
  - Recovery Score
- **Training Load Chart** visualizing last 10 workouts
- **AI Workout Recommendations** with reasoning and warnings
- **Recent Activity List** showing latest workouts

### Activity Logging
Three-tab interface for logging:
1. **Workouts** - Type, duration, distance, heart rate
2. **Sleep** - Hours and quality score (1-10)
3. **Nutrition** - Calories and macros (protein, carbs, fats)

## 🔧 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📦 Dependencies

- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 🎨 Styling

Custom CSS with:
- Gradient purple theme (`#667eea` to `#764ba2`)
- Responsive grid layouts
- Hover effects and transitions
- Mobile-friendly design

## 🔗 API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`:

- `POST /signup` - User registration
- `POST /login` - User authentication
- `GET /me` - Get user profile
- `GET /dashboard` - Get all dashboard data (single call)
- `POST /log-workout` - Log workout
- `POST /log-sleep` - Log sleep
- `POST /log-nutrition` - Log nutrition
- `POST /recommend` - Get AI workout recommendation

## 🧪 Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Usage Flow

1. **Sign up** or **Login** → Redirects to Dashboard
2. **View Dashboard** → See metrics, charts, and AI recommendations
3. **Click "Log Activity"** → Record workouts, sleep, or nutrition
4. **Click "Get New Recommendation"** → AI analyzes data and suggests next workout
5. **Logout** when done

---

Built with React + Vite for fast development and optimal performance! 🚀

