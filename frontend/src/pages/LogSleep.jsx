import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LogActivity.css';

export default function LogSleep() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hours: '',
    quality: '7',
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
        hours: parseFloat(formData.hours),
        quality: parseInt(formData.quality),
        notes: formData.notes || null
      };

      await api.post('/log-sleep', payload);
      setMessage({ type: 'success', text: 'Sleep logged successfully!' });
      
      // Reset form
      setFormData({
        hours: '',
        quality: '7',
        notes: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to log sleep'
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

        <h1>Log Sleep</h1>
        <p className="subtitle">How much sleep did you get last night?</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label htmlFor="hours">Hours of Sleep *</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              required
              min="0"
              max="24"
              step="0.5"
              placeholder="8"
            />
            <p className="help-text">Total hours you slept last night</p>
          </div>

          <div className="form-group">
            <label htmlFor="quality">Sleep Quality (1-10) *</label>
            <div className="quality-slider">
              <input
                type="range"
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                min="1"
                max="10"
                step="1"
              />
              <div className="quality-labels">
                <span>Poor</span>
                <span className="quality-value">{formData.quality}</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any disturbances? Dreams? How do you feel this morning?"
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
              {loading ? 'Logging...' : 'Log Sleep'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
