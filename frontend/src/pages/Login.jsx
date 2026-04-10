import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Service from '../api/services';
import '../auth.css';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [stats, setStats]       = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Service.dashboard.getStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await Service.auth.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-back-home">
            ← Back to home
          </Link>
          <div className="auth-brand">
            <span className="auth-brand-dot" />
            RentBreaker
          </div>
          <h2 className="auth-left-headline">
            Manage your fleet<br />
            <span className="auth-left-accent">smarter, faster.</span>
          </h2>
          <p className="auth-left-sub">
            The platform of choice for equipment rental businesses. Built for scale and operational excellence.
          </p>

          <div className="auth-stats-row">
            {[
              { val: stats ? `${stats.totalMachines}+` : '—', label: 'Machines tracked' },
              { val: stats ? `$${(stats.totalRevenue/1000).toFixed(0)}k+` : '—', label: 'Revenue managed' },
              { val: '24/7', label: 'System Uptime' },
            ].map(s => (
              <div key={s.label} className="auth-stat">
                <div className="auth-stat-val">{s.val}</div>
                <div className="auth-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="auth-testimonial">
            <div className="auth-testimonial-avatar">✓</div>
            <div>
              <div className="auth-testimonial-quote">"Efficient, data-driven, and intuitive."</div>
              <div className="auth-testimonial-author">Backend Integrated Solution</div>
            </div>
          </div>
        </div>

        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your RentBreaker account</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label">Password</label>
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={`auth-submit-btn ${loading ? 'auth-btn-loading' : ''}`} disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" />Signing in…</>
              ) : (
                <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to RentBreaker? <Link to="/signup">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
