import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enduranceAPI } from '../api/endurance';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendationLoading, setRecommendationLoading] = useState(false);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendation = async () => {
    try {
      setRecommendationLoading(true);
      await enduranceAPI.getRecommendation();
      // Refresh dashboard to show new recommendation
      await fetchDashboard();
    } catch (err) {
      setError('Failed to generate recommendation');
      console.error(err);
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
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Prepare chart data from recent workouts
  const chartData = dashboard.recent_workouts
    .slice(0, 10)
    .reverse()
    .map((workout) => ({
      date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      load: workout.training_load_score,
    }));

  const getFormStatusColor = (status) => {
    if (status.includes('Overreaching')) return '#f44336';
    if (status.includes('Optimal')) return '#4caf50';
    if (status.includes('Peak')) return '#2196f3';
    if (status.includes('Detraining')) return '#ff9800';
    return '#9e9e9e';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p className="subtitle">{user?.sport} • {user?.experience_level}</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/log')} className="btn-secondary">
            Log Activity
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Training Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Fitness (CTL)</h3>
          <div className="metric-value">{dashboard.metrics.fitness.ctl}</div>
          <p className="metric-description">{dashboard.metrics.fitness.description}</p>
        </div>

        <div className="metric-card">
          <h3>Fatigue (ATL)</h3>
          <div className="metric-value">{dashboard.metrics.fatigue.atl}</div>
          <p className="metric-description">{dashboard.metrics.fatigue.description}</p>
        </div>

        <div className="metric-card">
          <h3>Form (TSB)</h3>
          <div 
            className="metric-value" 
            style={{ color: getFormStatusColor(dashboard.metrics.form.status) }}
          >
            {dashboard.metrics.form.tsb}
          </div>
          <p className="metric-status">{dashboard.metrics.form.status}</p>
        </div>

        <div className="metric-card">
          <h3>Recovery</h3>
          <div className="metric-value">{dashboard.metrics.recovery.score}%</div>
          <p className="metric-description">{dashboard.metrics.recovery.recommendation}</p>
        </div>
      </div>

      {/* Training Load Chart */}
      <div className="chart-section">
        <h2>Training Load (Last 10 Workouts)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="load" stroke="#667eea" strokeWidth={2} name="Training Load" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendation */}
      <div className="recommendation-section">
        <div className="section-header">
          <h2>AI Workout Recommendation</h2>
          <button 
            onClick={handleGetRecommendation} 
            className="btn-primary"
            disabled={recommendationLoading}
          >
            {recommendationLoading ? 'Generating...' : 'Get New Recommendation'}
          </button>
        </div>

        {dashboard.latest_recommendation ? (
          <div className="recommendation-card">
            <div className="recommendation-header">
              <h3>{dashboard.latest_recommendation.recommendation_json.workout_type.toUpperCase()}</h3>
              <span className="recommendation-date">
                {new Date(dashboard.latest_recommendation.date).toLocaleDateString()}
              </span>
            </div>
            <div className="recommendation-details">
              <p><strong>Duration:</strong> {dashboard.latest_recommendation.recommendation_json.duration_minutes} minutes</p>
              <p><strong>Intensity:</strong> {dashboard.latest_recommendation.recommendation_json.intensity}</p>
              <p className="recommendation-description">
                {dashboard.latest_recommendation.recommendation_json.description}
              </p>
              {dashboard.latest_recommendation.recommendation_json.warnings && 
               dashboard.latest_recommendation.recommendation_json.warnings.length > 0 && (
                <div className="warnings">
                  <strong>⚠️ Warnings:</strong>
                  <ul>
                    {dashboard.latest_recommendation.recommendation_json.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-recommendation">
            <p>No recommendations yet. Click "Get New Recommendation" to get your personalized workout plan.</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Workouts ({dashboard.recent_workouts.length})</h2>
        <div className="activity-list">
          {dashboard.recent_workouts.slice(0, 5).map((workout) => (
            <div key={workout.id} className="activity-item">
              <div className="activity-date">
                {new Date(workout.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </div>
              <div className="activity-details">
                <span className="activity-type">{workout.workout_type}</span>
                <span className="activity-duration">{workout.duration} min</span>
                {workout.distance && <span>• {workout.distance} km</span>}
                {workout.avg_hr && <span>• {workout.avg_hr} bpm</span>}
              </div>
              <div className="activity-load">
                Load: {workout.training_load_score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
