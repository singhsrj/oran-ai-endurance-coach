import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enduranceAPI } from '../api/endurance';
import { useAuth } from '../contexts/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import './Dashboard.css';

const WorkoutTypeIcon = ({ type }) => {
  const icons = {
    easy: '🟢', tempo: '🟡', interval: '🔴', long: '🔵', rest: '⚪'
  };
  return <span>{icons[type] || '⚫'}</span>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">{payload[0].value} <span>load</span></p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await enduranceAPI.getDashboard();
      setDashboard(data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendation = async () => {
    try {
      setRecommendationLoading(true);
      await enduranceAPI.getRecommendation();
      await fetchDashboard();
    } catch (err) {
      setError('Failed to generate recommendation');
    } finally {
      setRecommendationLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="db-shell">
        <div className="db-loading">
          <div className="loading-ring"></div>
          <p>Loading your performance data…</p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="db-shell">
        <div className="db-error">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
          <button onClick={fetchDashboard} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  const chartData = dashboard.recent_workouts
    .slice(0, 10)
    .reverse()
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      load: w.training_load_score,
      type: w.workout_type,
    }));

  const getFormColor = (tsb) => {
    if (tsb < -50) return 'var(--danger)';
    if (tsb < -20) return 'var(--warning)';
    if (tsb >= 0) return 'var(--success)';
    return 'var(--accent)';
  };

  const getRecoveryColor = (score) => {
    if (score < 40) return 'var(--danger)';
    if (score < 65) return 'var(--warning)';
    return 'var(--success)';
  };

  const { metrics, latest_recommendation, recent_workouts, recent_sleep } = dashboard;
  const formColor = getFormColor(metrics.form.tsb);
  const recoveryColor = getRecoveryColor(metrics.recovery.recovery_score ?? metrics.recovery.score);
  const recoveryScore = metrics.recovery.recovery_score ?? metrics.recovery.score;

  return (
    <div className="db-shell">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Endure</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'overview', label: 'Overview', icon: '◉' },
            { id: 'workouts', label: 'Workouts', icon: '⊕' },
            { id: 'recovery', label: 'Recovery', icon: '♡' },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => navigate('/log-workout')} className="btn-log">
            <span>+</span> Log Workout
          </button>
          <button onClick={() => navigate('/log-sleep')} className="btn-log">
            <span>+</span> Log Sleep
          </button>
          <button onClick={() => navigate('/log-nutrition')} className="btn-log">
            <span>+</span> Log Nutrition
          </button>
          <button onClick={() => navigate('/profile')} className="btn-profile">
            ⚙️ Profile
          </button>
          <button onClick={handleLogout} className="btn-logout-side">
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="db-main">
        {/* Top bar */}
        <header className="db-topbar">
          <div className="topbar-user">
            <div className="user-avatar">
              {(user?.name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="topbar-name">Welcome back, {user?.name?.split(' ')[0]}.</h1>
              <p className="topbar-meta">
                <span className="pill">{user?.sport || dashboard.user?.sport}</span>
                <span className="pill">{user?.experience_level || dashboard.user?.experience_level}</span>
                <span className="pill goal">Goal: {user?.goal || dashboard.user?.goal}</span>
              </p>
            </div>
          </div>
          <div className="topbar-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {error && <div className="inline-error">⚠ {error}</div>}

        {/* Metric Cards */}
        <section className="metrics-row">
          <div className="metric-tile fitness">
            <div className="metric-label">Fitness · CTL</div>
            <div className="metric-big">{metrics.fitness.ctl}</div>
            <div className="metric-sub">Chronic Training Load</div>
            <div className="metric-bar-track">
              <div className="metric-bar-fill" style={{ width: `${Math.min(metrics.fitness.ctl, 100)}%`, background: 'var(--accent)' }}></div>
            </div>
          </div>

          <div className="metric-tile fatigue">
            <div className="metric-label">Fatigue · ATL</div>
            <div className="metric-big warning-text">{metrics.fatigue.atl}</div>
            <div className="metric-sub">Acute Training Load</div>
            <div className="metric-bar-track">
              <div className="metric-bar-fill" style={{ width: `${Math.min(metrics.fatigue.atl / 2, 100)}%`, background: 'var(--warning)' }}></div>
            </div>
          </div>

          <div className="metric-tile form">
            <div className="metric-label">Form · TSB</div>
            <div className="metric-big" style={{ color: formColor }}>{metrics.form.tsb}</div>
            <div className="metric-sub" style={{ color: formColor }}>{metrics.form.status}</div>
          </div>

          <div className="metric-tile recovery">
            <div className="metric-label">Recovery</div>
            <div className="metric-big" style={{ color: recoveryColor }}>{recoveryScore}<span className="metric-pct">%</span></div>
            <div className="metric-sub">{metrics.recovery.recommendation}</div>
          </div>
        </section>

        <div className="db-grid">
          {/* Chart */}
          <div className="db-card chart-card">
            <div className="card-header">
              <h2>Training Load</h2>
              <span className="card-badge">Last 10 sessions</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke="#00e5ff"
                  strokeWidth={2}
                  fill="url(#loadGrad)"
                  dot={{ fill: '#00e5ff', r: 3 }}
                  activeDot={{ r: 5, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Recommendation */}
          <div className="db-card rec-card">
            <div className="card-header">
              <h2>AI Recommendation</h2>
              <button
                onClick={handleGetRecommendation}
                className="btn-gen"
                disabled={recommendationLoading}
              >
                {recommendationLoading ? (
                  <><span className="spin">◌</span> Generating</>
                ) : (
                  '⟳ Refresh'
                )}
              </button>
            </div>

            {latest_recommendation ? (
              <div className="rec-body">
                <div className="rec-type-row">
                  <span className="rec-type-badge">{latest_recommendation.recommendation_json.workout_type.toUpperCase()}</span>
                  <span className="rec-date">{new Date(latest_recommendation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="rec-stats">
                  <div className="rec-stat">
                    <span className="rec-stat-label">Duration</span>
                    <span className="rec-stat-val">{latest_recommendation.recommendation_json.duration_minutes} <small>min</small></span>
                  </div>
                  <div className="rec-stat">
                    <span className="rec-stat-label">Intensity</span>
                    <span className={`rec-stat-val intensity-${latest_recommendation.recommendation_json.intensity}`}>
                      {latest_recommendation.recommendation_json.intensity}
                    </span>
                  </div>
                </div>
                <p className="rec-desc">{latest_recommendation.recommendation_json.description}</p>
                {latest_recommendation.recommendation_json.warnings?.length > 0 && (
                  <div className="rec-warnings">
                    <span className="warn-icon">⚠</span>
                    <ul>
                      {latest_recommendation.recommendation_json.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="rec-empty">
                <p>No recommendation yet.</p>
                <p className="rec-empty-sub">Click Refresh to generate your personalized plan.</p>
              </div>
            )}
          </div>

          {/* Recent Workouts */}
          <div className="db-card workouts-card">
            <div className="card-header">
              <h2>Recent Workouts</h2>
              <span className="card-badge">{recent_workouts.length} total</span>
            </div>
            <div className="workout-list">
              {recent_workouts.slice(0, 6).map((w) => (
                <div key={w.id} className="workout-row">
                  <div className="workout-left">
                    <WorkoutTypeIcon type={w.workout_type} />
                    <div>
                      <span className="workout-type">{w.workout_type}</span>
                      <span className="workout-date">
                        {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="workout-meta">
                    {w.duration && <span>{w.duration}m</span>}
                    {w.distance && <span>{w.distance}km</span>}
                    {w.avg_hr && <span>{w.avg_hr}bpm</span>}
                  </div>
                  <div className="workout-load" style={{
                    background: w.training_load_score > 100 ? 'rgba(255,75,75,0.12)' :
                      w.training_load_score > 60 ? 'rgba(255,200,0,0.1)' : 'rgba(0,229,255,0.08)'
                  }}>
                    {w.training_load_score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep & Recovery panel */}
          <div className="db-card sleep-card">
            <div className="card-header">
              <h2>Sleep Log</h2>
              <span className="card-badge">Recent nights</span>
            </div>
            <div className="sleep-list">
              {recent_sleep?.slice(0, 5).map((s) => (
                <div key={s.id} className="sleep-row">
                  <span className="sleep-date">
                    {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <div className="sleep-bar-wrap">
                    <div className="sleep-bar" style={{ width: `${(s.hours / 10) * 100}%` }}></div>
                  </div>
                  <span className="sleep-hrs">{s.hours}h</span>
                  <span className={`sleep-quality q${s.quality_score}`}>{s.quality_score}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}