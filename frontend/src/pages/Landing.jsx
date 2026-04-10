import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Service from '../api/services';
import '../landing.css';

const Landing = () => {
  const [stats, setStats] = useState(null);
  const [recentMachines, setRecentMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [s, m] = await Promise.all([
          Service.dashboard.getStats(),
          Service.machines.get()
        ]);
        setStats(s.data);
        setRecentMachines(m.data.slice(0, 4));
      } catch (e) {
        console.error('Landing fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="landing-root">

      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo-dot" />
            RentBreaker
          </Link>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Stats</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="landing-nav-cta">
            <Link to="/login" className="landing-btn-ghost">Sign In</Link>
            <Link to="/signup" className="landing-btn-solid">Get Started →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-orb orb-1" />
        <div className="hero-bg-orb orb-2" />
        <div className="hero-content">
          <div className="hero-badge">🚀 Empowering equipment fleet managers</div>
          <h1 className="hero-title">
            The Smarter Way to
            <span className="hero-title-gradient"> Manage Your Fleet</span>
          </h1>
          <p className="hero-subtitle">
            Rent Breaker streamlines machine rentals, maintenance tracking, and customer management
            into one powerful, intuitive platform. Built for modern equipment businesses.
          </p>
          <div className="hero-cta-group">
            <Link to="/signup" className="hero-cta-primary">
              Start Free Today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/login" className="hero-cta-secondary">
              View Dashboard
            </Link>
          </div>
          <div className="hero-trust">
            <span>✓ No credit card required</span>
            <span>✓ Secure & Scalable</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        {/* Dashboard Preview Card - LIVE DATA */}
        <div className="hero-visual">
          <div className="hero-dashboard-card">
            <div className="hd-header">
              <div className="hd-dot red" /><div className="hd-dot yellow" /><div className="hd-dot green" />
              <span className="hd-title">RentBreaker Dashboard Preview</span>
            </div>
            <div className="hd-stats-row">
              <div className="hd-stat">
                <div className="hd-stat-icon">🚜</div>
                <div className="hd-stat-val">{stats?.totalMachines || 0}</div>
                <div className="hd-stat-label">Total Machines</div>
                <div className="hd-stat-delta">Live inventory</div>
              </div>
              <div className="hd-stat">
                <div className="hd-stat-icon">📋</div>
                <div className="hd-stat-val">{stats?.activeRentals || 0}</div>
                <div className="hd-stat-label">Active Rentals</div>
                <div className="hd-stat-delta">{stats?.activeRentals > 0 ? 'Fleet working' : 'Ready to rent'}</div>
              </div>
              <div className="hd-stat">
                <div className="hd-stat-icon">💰</div>
                <div className="hd-stat-val">${stats?.totalRevenue ? (stats.totalRevenue/1000).toFixed(1) : '0'}k</div>
                <div className="hd-stat-label">Total Revenue</div>
                <div className="hd-stat-delta">Lifetime billing</div>
              </div>
            </div>
            <div className="hd-table-preview">
              <div className="hd-table-header">
                <span>Machine</span><span>Status</span><span>Price/Day</span>
              </div>
              {recentMachines.length > 0 ? recentMachines.map(m => (
                <div key={m._id} className="hd-table-row">
                  <span className="hd-table-name">{m.name}</span>
                  <span className={`hd-pill hd-pill-${m.status.toLowerCase()}`}>{m.status}</span>
                  <span className="hd-table-rev">${m.rentalPricePerDay}</span>
                </div>
              )) : (
                <div style={{padding:'1.5rem', textAlign:'center', fontSize:'0.8rem', color:'var(--text-muted)'}}>No machines registered yet.</div>
              )}
            </div>
          </div>
          {/* floating badges */}
          <div className="hero-float-badge badge-a">
            <span className="float-icon">✅</span>
            <div>
              <div className="float-title">System Verified</div>
              <div className="float-sub">Backend Active</div>
            </div>
          </div>
          <div className="hero-float-badge badge-b">
            <span className="float-icon">⚡</span>
            <div>
              <div className="float-title">Real-time Data</div>
              <div className="float-sub">MERN Stack Power</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS ── */}
      <section className="logos-section">
        <p className="logos-label">Standardized for reliability across Pakistani markets</p>
        <div className="logos-row">
          {['HeavyLift Pakistan', 'Sindh Rents', 'Lahore Fleet Co.', 'Machina Group', 'BuildDirect.'].map(l => (
            <div key={l} className="logo-chip">{l}</div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="features-section">
        <div className="section-label">Platform Features</div>
        <h2 className="section-title">Everything your fleet needs,<br />in one place</h2>
        <p className="section-sub">From onboarding customers to closing rentals and scheduling maintenance — RentBreaker handles it all.</p>

        <div className="features-grid">
          {[
            { icon: '🚜', title: 'Smart Fleet Management', desc: `Track every machine's availability, location, and status in real time.`, color: '#96DD99' },
            { icon: '📋', title: 'Seamless Rental Agreements', desc: 'Create and manage contracts. Automated billing and balance tracking included.', color: '#A5E1A6' },
            { icon: '👤', title: 'Customer Profiles', desc: 'Maintain customer contact info, rental history, and CNIC records.', color: '#B3E5B3' },
            { icon: '🔧', title: 'Maintenance Logging', desc: 'Log service records and costs per machine. Catch issues early.', color: '#C2E9BF' },
            { icon: '📊', title: 'Revenue Analytics', desc: 'High-level dashboards with trend analysis and machine-level performance.', color: '#D7F5D3' },
            { icon: '🔐', title: 'Role-Based Access', desc: `Secure Admin and User roles with JWT authentication.`, color: '#96DD99' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.color + '30', border: `1px solid ${f.color}` }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-learn">Learn more →</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="stats-section">
        <div className="stats-inner">
          <div className="stats-text">
            <div className="section-label" style={{ color: 'var(--primary)' }}>Real-time Statistics</div>
            <h2 className="section-title" style={{ color: '#fff' }}>Driven by backend data,<br />proven by usage</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginTop: '1rem', maxWidth: '340px' }}>
              Our platform calculates your organization's performance live directly from your database.
            </p>
            <Link to="/signup" className="stats-cta">Build Your Fleet →</Link>
          </div>
          <div className="stats-grid">
            {[
              { val: stats?.totalCustomers || 0, label: 'Customers Registered', icon: '👥' },
              { val: stats?.totalMachines || 0, label: 'Machines Tracked', icon: '🚜' },
              { val: `$${stats?.totalRevenue ? (stats.totalRevenue/1000).toFixed(1) : '0'}k`, label: 'Total Volume', icon: '💰' },
              { val: '100%', label: 'Cloud Uptime', icon: '⚡' },
              { val: '24/7', label: 'Monitoring', icon: '🚀' },
            ].map(s => (
              <div key={s.label} className="stat-box">
                <div className="stat-box-icon">{s.icon}</div>
                <div className="stat-box-val">{s.val}</div>
                <div className="stat-box-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-label">User Feedback</div>
        <h2 className="section-title">Designed for usability</h2>
        <div className="testimonials-grid">
          {[
            { quote: "Intuitive and powerful. My team picked it up in a day.", name: 'Hamza', role: 'Operations', avatar: 'H' },
            { quote: "The billing accuracy has improved significantly.", name: 'Sara', role: 'Finance', avatar: 'S' },
            { quote: "Great for tracking machine downtime.", name: 'Umar', role: 'Maintenance', avatar: 'U' },
          ].map(t => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
        <h2 className="cta-title">Ready to take control of your fleet?</h2>
        <p className="cta-sub">Join the growing community of businesses using RentBreaker to operate smarter.</p>
        <div className="cta-btn-group">
          <Link to="/signup" className="hero-cta-primary">Create Free Account</Link>
          <Link to="/login" className="cta-ghost-btn">Sign In Instead</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-logo" style={{ fontSize: '1.1rem' }}>
              <span className="landing-logo-dot" />
              RentBreaker
            </div>
            <p className="footer-tagline">The modern platform for equipment rental management. Built for teams that move fast.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <div className="footer-col-title">Platform</div>
              <Link to="/signup">Register</Link>
              <Link to="/login">Login</Link>
              <a href="#stats">Stats</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Resources</div>
              <a href="#">Help Center</a>
              <a href="#">API Docs</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RentBreaker. All rights reserved.</span>
          <span>Managed Backend Solution</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
