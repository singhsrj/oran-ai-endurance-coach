import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LogActivity.css';

export default function LogNutrition() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
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
        meal_type: formData.meal_type,
        calories: formData.calories ? parseFloat(formData.calories) : null,
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fats: formData.fats ? parseFloat(formData.fats) : null,
        notes: formData.notes || null
      };

      await api.post('/log-nutrition', payload);
      setMessage({ type: 'success', text: 'Nutrition logged successfully! You can add another meal.' });
      
      // Reset form but keep page open for multiple entries
      setFormData({
        meal_type: 'snack',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        notes: ''
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to log nutrition'
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

        <h1>Log Nutrition</h1>
        <p className="subtitle">Track your meals and macros for today</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label htmlFor="meal_type">Meal Type *</label>
            <select
              id="meal_type"
              name="meal_type"
              value={formData.meal_type}
              onChange={handleChange}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="pre_workout">Pre-Workout</option>
              <option value="post_workout">Post-Workout</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="calories">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="500"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="protein">Protein (g)</label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="carbs">Carbs (g)</label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fats">Fats (g)</label>
              <input
                type="number"
                id="fats"
                name="fats"
                value={formData.fats}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="15"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">What did you eat?</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Chicken breast, rice, vegetables..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Done
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging...' : 'Add Meal'}
            </button>
          </div>
        </form>

        <div className="info-box">
          <p>💡 <strong>Tip:</strong> You can add multiple meals throughout the day. Your workout recommendations will account for all nutrition logged today.</p>
        </div>
      </div>
    </div>
  );
}
