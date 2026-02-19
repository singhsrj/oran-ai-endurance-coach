import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
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
        <Link to="/signup" className="nav-signup-btn">Sign Up</Link>
      </nav>

      {/* ── Three-column hero ── */}
      <div className="auth-hero">

        {/* Left image panel */}
        <div className="auth-panel auth-panel-left">
          <div className="panel-overlay" />
          <img src="/src/assets/max-jolliffe.png" alt="" />
          <div className="panel-stat-overlay">
            <span className="panel-stat-num">10K+</span>
            <span className="panel-stat-label">Athletes Tracked</span>
          </div>
        </div>

        {/* Center form (light) */}
        <div className="auth-center">
          <div className="auth-center-inner">
            <img src="/src/assets/logo.png" alt="Endure" className="center-logo" />
            <h1 className="center-headline">AI-Powered<br/>Endurance Coach</h1>
            <p className="center-sub">Train with precision. Recover with intent. Perform at your peak.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  required placeholder="you@example.com"
                />
              </div>
              <div className="field-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password" id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  required placeholder="••••••••"
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : null}
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Sign up free</Link>
            </p>
          </div>
        </div>

        {/* Right image panel */}
        <div className="auth-panel auth-panel-right">
          <div className="panel-overlay" />
          <img src="/src/assets/TruettHanes3.png" alt="" />
          <div className="panel-stat-overlay">
            <span className="panel-stat-num">95%</span>
            <span className="panel-stat-label">Recovery Accuracy</span>
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