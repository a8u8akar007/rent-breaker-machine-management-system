import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import '../auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPass, setShowPass]   = useState(false);
  const [strength, setStrength]   = useState(0);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      setSuccess('Account created! Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength];

  return (
    <div className="auth-root">
      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-back-home">← Back to home</Link>
          <div className="auth-brand">
            <span className="auth-brand-dot" />
            RentBreaker
          </div>
          <h2 className="auth-left-headline">
            Your fleet command<br />
            <span className="auth-left-accent">center awaits.</span>
          </h2>
          <p className="auth-left-sub">
            Set up your account in under 2 minutes and start managing your rental fleet today.
          </p>

          {/* Feature checklist */}
          <div className="auth-checklist">
            {[
              'Real-time fleet status tracking',
              'Automated rental billing',
              'Customer profile management',
              'Maintenance logs & cost reports',
              'Role-based team access control',
            ].map(item => (
              <div key={item} className="auth-check-item">
                <span className="auth-check-icon">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Free for 14 days · No credit card required</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="auth-form">
            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Work email</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={e => { setFormData({ ...formData, password: e.target.value }); calcStrength(e.target.value); }}
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
              {/* Password strength bar */}
              {formData.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="auth-strength-bar"
                        style={{ background: i <= strength ? strengthColor : 'var(--border)' }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Role Selector */}
            <div className="auth-field">
              <label className="auth-label">Account type</label>
              <div className="auth-role-selector">
                <button
                  type="button"
                  className={`auth-role-option ${formData.role === 'user' ? 'auth-role-active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                >
                  <span className="auth-role-icon">👤</span>
                  <div>
                    <div className="auth-role-title">Standard User</div>
                    <div className="auth-role-desc">Browse & manage rentals</div>
                  </div>
                  {formData.role === 'user' && <span className="auth-role-check">✓</span>}
                </button>
                <button
                  type="button"
                  className={`auth-role-option ${formData.role === 'admin' ? 'auth-role-active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                >
                  <span className="auth-role-icon">🔐</span>
                  <div>
                    <div className="auth-role-title">Administrator</div>
                    <div className="auth-role-desc">Full fleet & system access</div>
                  </div>
                  {formData.role === 'admin' && <span className="auth-role-check">✓</span>}
                </button>
              </div>
            </div>

            <button type="submit" className={`auth-submit-btn ${loading ? 'auth-btn-loading' : ''}`} disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" />Creating account…</>
              ) : (
                <>Create Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>

            <p className="auth-terms">
              By creating an account you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
