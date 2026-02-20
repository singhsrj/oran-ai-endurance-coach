import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LogActivity.css';

export default function LogWorkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    workout_type: 'easy',
    duration: '',
    distance: '',
    avg_hr: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        date: formData.date,
        workout_type: formData.workout_type,
        duration: parseFloat(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : null,
        avg_hr: formData.avg_hr ? parseInt(formData.avg_hr) : null,
        notes: formData.notes || null
      };

      await api.post('/log-workout', payload);
      setMessage({ type: 'success', text: 'Workout logged successfully!' });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        workout_type: 'easy',
        duration: '',
        distance: '',
        avg_hr: '',
        notes: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to log workout'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-activity-container">
      <div className="log-activity-card">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <h1>Log Workout</h1>
        <p className="subtitle">Track your training session</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="workout_type">Workout Type *</label>
            <select
              id="workout_type"
              name="workout_type"
              value={formData.workout_type}
              onChange={handleChange}
              required
            >
              <option value="easy">Easy</option>
              <option value="tempo">Tempo</option>
              <option value="interval">Interval</option>
              <option value="long">Long Run</option>
              <option value="race">Race</option>
              <option value="rest">Rest/Recovery</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                step="0.1"
                placeholder="60"
              />
            </div>

            <div className="form-group">
              <label htmlFor="distance">Distance (km)</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="10"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="avg_hr">Average Heart Rate (bpm)</label>
            <input
              type="number"
              id="avg_hr"
              name="avg_hr"
              value={formData.avg_hr}
              onChange={handleChange}
              min="40"
              max="220"
              placeholder="150"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="How did you feel? Any observations..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging...' : 'Log Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
