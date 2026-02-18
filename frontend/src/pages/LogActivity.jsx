import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enduranceAPI } from '../api/endurance';
import './LogActivity.css';

export default function LogActivity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workout');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Workout form state
  const [workoutData, setWorkoutData] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    avg_hr: '',
    workout_type: 'easy',
  });

  // Sleep form state
  const [sleepData, setSleepData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    quality_score: '7',
  });

  // Nutrition form state
  const [nutritionData, setNutritionData] = useState({
    date: new Date().toISOString().split('T')[0],
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        date: workoutData.date,
        distance: workoutData.distance ? parseFloat(workoutData.distance) : null,
        duration: parseFloat(workoutData.duration),
        avg_hr: workoutData.avg_hr ? parseInt(workoutData.avg_hr) : null,
        workout_type: workoutData.workout_type,
      };
      
      await enduranceAPI.logWorkout(submitData);
      setSuccess('Workout logged successfully!');
      // Reset form
      setWorkoutData({
        date: new Date().toISOString().split('T')[0],
        distance: '',
        duration: '',
        avg_hr: '',
        workout_type: 'easy',
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        date: sleepData.date,
        hours: parseFloat(sleepData.hours),
        quality_score: parseInt(sleepData.quality_score),
      };
      
      await enduranceAPI.logSleep(submitData);
      setSuccess('Sleep logged successfully!');
      // Reset form
      setSleepData({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        quality_score: '7',
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log sleep');
    } finally {
      setLoading(false);
    }
  };

  const handleNutritionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        date: nutritionData.date,
        calories: parseFloat(nutritionData.calories),
        protein: parseFloat(nutritionData.protein),
        carbs: parseFloat(nutritionData.carbs),
        fats: parseFloat(nutritionData.fats),
      };
      
      await enduranceAPI.logNutrition(submitData);
      setSuccess('Nutrition logged successfully!');
      // Reset form
      setNutritionData({
        date: new Date().toISOString().split('T')[0],
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log nutrition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-activity-container">
      <div className="log-activity-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>Log Activity</h1>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          🏃 Workout
        </button>
        <button 
          className={`tab ${activeTab === 'sleep' ? 'active' : ''}`}
          onClick={() => setActiveTab('sleep')}
        >
          😴 Sleep
        </button>
        <button 
          className={`tab ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          🍎 Nutrition
        </button>
      </div>

      <div className="form-container">
        {activeTab === 'workout' && (
          <form onSubmit={handleWorkoutSubmit}>
            <h2>Log Workout</h2>
            
            <div className="form-group">
              <label htmlFor="workout-date">Date *</label>
              <input
                type="date"
                id="workout-date"
                value={workoutData.date}
                onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="workout-type">Workout Type *</label>
              <select
                id="workout-type"
                value={workoutData.workout_type}
                onChange={(e) => setWorkoutData({ ...workoutData, workout_type: e.target.value })}
                required
              >
                <option value="easy">Easy</option>
                <option value="tempo">Tempo</option>
                <option value="interval">Interval</option>
                <option value="long">Long Run</option>
                <option value="race">Race</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes) *</label>
                <input
                  type="number"
                  id="duration"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
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
                  value={workoutData.distance}
                  onChange={(e) => setWorkoutData({ ...workoutData, distance: e.target.value })}
                  min="0"
                  step="0.1"
                  placeholder="10.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avg-hr">Average HR (bpm)</label>
                <input
                  type="number"
                  id="avg-hr"
                  value={workoutData.avg_hr}
                  onChange={(e) => setWorkoutData({ ...workoutData, avg_hr: e.target.value })}
                  min="40"
                  max="220"
                  placeholder="145"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging...' : 'Log Workout'}
            </button>
          </form>
        )}

        {activeTab === 'sleep' && (
          <form onSubmit={handleSleepSubmit}>
            <h2>Log Sleep</h2>
            
            <div className="form-group">
              <label htmlFor="sleep-date">Date *</label>
              <input
                type="date"
                id="sleep-date"
                value={sleepData.date}
                onChange={(e) => setSleepData({ ...sleepData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hours">Hours of Sleep *</label>
              <input
                type="number"
                id="hours"
                value={sleepData.hours}
                onChange={(e) => setSleepData({ ...sleepData, hours: e.target.value })}
                required
                min="0"
                max="24"
                step="0.5"
                placeholder="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quality">Sleep Quality (1-10) *</label>
              <input
                type="range"
                id="quality"
                value={sleepData.quality_score}
                onChange={(e) => setSleepData({ ...sleepData, quality_score: e.target.value })}
                min="1"
                max="10"
                required
              />
              <div className="range-value">{sleepData.quality_score} / 10</div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging...' : 'Log Sleep'}
            </button>
          </form>
        )}

        {activeTab === 'nutrition' && (
          <form onSubmit={handleNutritionSubmit}>
            <h2>Log Nutrition</h2>
            
            <div className="form-group">
              <label htmlFor="nutrition-date">Date *</label>
              <input
                type="date"
                id="nutrition-date"
                value={nutritionData.date}
                onChange={(e) => setNutritionData({ ...nutritionData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="calories">Calories *</label>
              <input
                type="number"
                id="calories"
                value={nutritionData.calories}
                onChange={(e) => setNutritionData({ ...nutritionData, calories: e.target.value })}
                required
                min="0"
                placeholder="2500"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="protein">Protein (g) *</label>
                <input
                  type="number"
                  id="protein"
                  value={nutritionData.protein}
                  onChange={(e) => setNutritionData({ ...nutritionData, protein: e.target.value })}
                  required
                  min="0"
                  step="0.1"
                  placeholder="150"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbs">Carbs (g) *</label>
                <input
                  type="number"
                  id="carbs"
                  value={nutritionData.carbs}
                  onChange={(e) => setNutritionData({ ...nutritionData, carbs: e.target.value })}
                  required
                  min="0"
                  step="0.1"
                  placeholder="300"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fats">Fats (g) *</label>
                <input
                  type="number"
                  id="fats"
                  value={nutritionData.fats}
                  onChange={(e) => setNutritionData({ ...nutritionData, fats: e.target.value })}
                  required
                  min="0"
                  step="0.1"
                  placeholder="80"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging...' : 'Log Nutrition'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
