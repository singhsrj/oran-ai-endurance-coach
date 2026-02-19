import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Weekly activity state
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    sport: user?.sport || '',
    experience_level: user?.experience_level || '',
    goal: user?.goal || ''
  });

  // Fetch weekly activity data
  useEffect(() => {
    fetchWeeklyActivity();
  }, []);

  const fetchWeeklyActivity = async () => {
    try {
      setActivityLoading(true);
      const response = await api.get('/weekly-activity');
      setWeeklyActivity(response.data.weekly_activity);
    } catch (error) {
      console.error('Failed to fetch weekly activity:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  // Handle profile picture upload
  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setUploadingPicture(true);
      
      try {
        await updateProfile({ profile_picture: base64String });
        setProfilePicture(base64String);
        setMessage({ type: 'success', text: 'Profile picture updated!' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update profile picture' });
      } finally {
        setUploadingPicture(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'activity' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button 
          className={activeTab === 'security' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="profile-content">
          {/* Profile Picture Section */}
          <div className="profile-card">
            <h2>Profile Picture</h2>
            <div className="picture-section">
              <div className="picture-preview">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <div className="picture-placeholder">
                    <span>👤</span>
                  </div>
                )}
              </div>
              <div className="picture-actions">
                <label htmlFor="picture-upload" className="btn-secondary">
                  {uploadingPicture ? 'Uploading...' : 'Change Picture'}
                </label>
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  style={{ display: 'none' }}
                  disabled={uploadingPicture}
                />
                <p className="help-text">JPG, PNG or GIF (max 2MB)</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className="btn-secondary" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={profileData.height}
                      onChange={(e) => setProfileData({ ...profileData, height: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({ ...profileData, weight: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Sport</label>
                    <select
                      value={profileData.sport}
                      onChange={(e) => setProfileData({ ...profileData, sport: e.target.value })}
                    >
                      <option value="running">Running</option>
                      <option value="cycling">Cycling</option>
                      <option value="swimming">Swimming</option>
                      <option value="triathlon">Triathlon</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Experience Level</label>
                    <select
                      value={profileData.experience_level}
                      onChange={(e) => setProfileData({ ...profileData, experience_level: e.target.value })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="elite">Elite</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Training Goal</label>
                    <input
                      type="text"
                      value={profileData.goal}
                      onChange={(e) => setProfileData({ ...profileData, goal: e.target.value })}
                      placeholder="e.g., Run a marathon in under 4 hours"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user?.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Age:</span>
                  <span className="info-value">{user?.age || 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Height:</span>
                  <span className="info-value">{user?.height ? `${user.height} cm` : 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Weight:</span>
                  <span className="info-value">{user?.weight ? `${user.weight} kg` : 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Sport:</span>
                  <span className="info-value">{user?.sport || 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Experience:</span>
                  <span className="info-value">{user?.experience_level || 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Goal:</span>
                  <span className="info-value">{user?.goal || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="profile-content">
          <div className="profile-card">
            <h2>Weekly Activity</h2>
            {activityLoading ? (
              <div className="loading">Loading activity data...</div>
            ) : weeklyActivity.length > 0 ? (
              <>
                {/* Duration Chart */}
                <div className="chart-container">
                  <h3>Training Duration (minutes)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #333', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="duration" fill="#00e5ff" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Training Load Chart */}
                <div className="chart-container">
                  <h3>Training Load Score</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #333', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="training_load" 
                        stroke="#7b61ff" 
                        strokeWidth={3}
                        dot={{ fill: '#7b61ff', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Weekly Summary */}
                <div className="weekly-summary">
                  <h3>Weekly Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-card">
                      <span className="summary-label">Total Workouts</span>
                      <span className="summary-value">
                        {weeklyActivity.reduce((sum, day) => sum + day.workout_count, 0)}
                      </span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Total Duration</span>
                      <span className="summary-value">
                        {Math.round(weeklyActivity.reduce((sum, day) => sum + day.duration, 0))} min
                      </span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Total Load</span>
                      <span className="summary-value">
                        {Math.round(weeklyActivity.reduce((sum, day) => sum + day.training_load, 0))}
                      </span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Avg Load/Day</span>
                      <span className="summary-value">
                        {Math.round(weeklyActivity.reduce((sum, day) => sum + day.training_load, 0) / 7)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No activity data available for the past 7 days</p>
                <p className="help-text">Start logging your workouts to see your activity trends!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="profile-content">
          <div className="profile-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  required
                  placeholder="Confirm new password"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
