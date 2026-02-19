import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', age: '',
    height: '', weight: '', sport: 'running',
    experience_level: 'intermediate', goal: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const submitData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        sport: formData.sport || null,
        experience_level: formData.experience_level || null,
        goal: formData.goal || null,
      };
      await signup(submitData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">

      {/* ── Dark Navbar ── */}
      <nav className="auth-nav">
        <div className="auth-nav-logo">
          <img src="/src/assets/logo.png" alt="Endure" className="nav-logo-img" />
        </div>
        <div className="auth-nav-links">
          <span>Features</span>
          <span>Science</span>
          <span>Plans</span>
        </div>
        <Link to="/login" className="nav-signup-btn">Log In</Link>
      </nav>

      {/* ── Three-column hero ── */}
      <div className="auth-hero">

        {/* Left panel */}
        <div className="auth-panel auth-panel-left">
          <div className="panel-overlay" />
          <div className="panel-placeholder">
            <div className="placeholder-inner">
              <span className="ph-icon">🚴</span>
              <p className="ph-label">Push Limits</p>
              <p className="ph-sub">Add your image here</p>
            </div>
          </div>
          <div className="panel-stat-overlay">
            <span className="panel-stat-num">4×</span>
            <span className="panel-stat-label">Faster Recovery</span>
          </div>
        </div>

        {/* Center form — signup has more fields so it scrolls */}
        <div className="auth-center auth-center-signup">
          <div className="auth-center-inner">
            <img src="/src/assets/logo.png" alt="Endure" className="center-logo" />
            <h1 className="center-headline">Join Endure</h1>
            <p className="center-sub">Your AI coach is ready. Let's build your profile.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder="you@example.com" />
              </div>

              <div className="field-group">
                <label>Password *</label>
                <input type="password" name="password" value={formData.password}
                  onChange={handleChange} required placeholder="••••••••" minLength="6" />
              </div>

              <div className="field-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={formData.name}
                  onChange={handleChange} required placeholder="John Doe" />
              </div>

              <div className="field-row-3">
                <div className="field-group">
                  <label>Age</label>
                  <input type="number" name="age" value={formData.age}
                    onChange={handleChange} placeholder="30" />
                </div>
                <div className="field-group">
                  <label>Height (cm)</label>
                  <input type="number" name="height" value={formData.height}
                    onChange={handleChange} placeholder="175" />
                </div>
                <div className="field-group">
                  <label>Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight}
                    onChange={handleChange} placeholder="70" />
                </div>
              </div>

              <div className="field-row-2">
                <div className="field-group">
                  <label>Sport</label>
                  <select name="sport" value={formData.sport} onChange={handleChange}>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="triathlon">Triathlon</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Experience</label>
                  <select name="experience_level" value={formData.experience_level} onChange={handleChange}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </div>

              <div className="field-group">
                <label>Training Goal</label>
                <input type="text" name="goal" value={formData.goal}
                  onChange={handleChange} placeholder="e.g., Run a marathon in under 4 hours" />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : null}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-panel auth-panel-right">
          <div className="panel-overlay" />
          <div className="panel-placeholder">
            <div className="placeholder-inner">
              <span className="ph-icon">🏅</span>
              <p className="ph-label">Reach Your Goal</p>
              <p className="ph-sub">Add your image here</p>
            </div>
          </div>
          <div className="panel-stat-overlay">
            <span className="panel-stat-num">AI</span>
            <span className="panel-stat-label">Personalized Plans</span>
          </div>
        </div>
      </div>

      {/* ── Dark Footer ── */}
      <footer className="auth-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <img src="/src/assets/logo.png" alt="Endure" className="footer-logo" />
            <p className="footer-tagline">Intelligent training for serious athletes.</p>
          </div>
          <div className="footer-col">
            <h4>Problem Statement</h4>
            <p>Most endurance athletes train without objective data on their readiness, leading to overtraining, injury, and stagnation. Generic plans don't adapt to how your body actually feels today.</p>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <p>Endure uses CTL, ATL, and TSB metrics — the same science used by elite coaches — combined with AI to give every athlete a personalized, adaptive training plan updated daily.</p>
          </div>
          <div className="footer-col">
            <h4>Future Implications</h4>
            <p>As wearable data matures, Endure will integrate real-time HRV, sleep staging, and GPS to build the most precise athlete performance model ever available to amateur athletes.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Endure. Built for athletes, by athletes.</span>
        </div>
      </footer>

    </div>
  );
}