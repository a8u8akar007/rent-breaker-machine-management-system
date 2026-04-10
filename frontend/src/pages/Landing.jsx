import { Link } from 'react-router-dom';
import '../landing.css';

const Landing = () => {
  return (
    <div className="landing-root">

      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <a href="#" className="landing-logo">
            <span className="landing-logo-dot" />
            RentBreaker
          </a>
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
          <div className="hero-badge">🚀 Trusted by 200+ fleet managers</div>
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
              View Demo
            </Link>
          </div>
          <div className="hero-trust">
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div className="hero-visual">
          <div className="hero-dashboard-card">
            <div className="hd-header">
              <div className="hd-dot red" /><div className="hd-dot yellow" /><div className="hd-dot green" />
              <span className="hd-title">RentBreaker Dashboard</span>
            </div>
            <div className="hd-stats-row">
              {[
                { label: 'Total Machines', value: '48', delta: '+3 this week', icon: '🚜' },
                { label: 'Active Rentals', value: '31', delta: '+7 this month', icon: '📋' },
                { label: 'Revenue', value: '$42k', delta: '+18% MoM', icon: '💰' },
              ].map(s => (
                <div key={s.label} className="hd-stat">
                  <div className="hd-stat-icon">{s.icon}</div>
                  <div className="hd-stat-val">{s.value}</div>
                  <div className="hd-stat-label">{s.label}</div>
                  <div className="hd-stat-delta">{s.delta}</div>
                </div>
              ))}
            </div>
            <div className="hd-table-preview">
              <div className="hd-table-header">
                <span>Machine</span><span>Status</span><span>Revenue</span>
              </div>
              {[
                { name: 'Excavator XT-500', status: 'Rented', rev: '$1,200' },
                { name: 'Crane Pro 220', status: 'Available', rev: '$980' },
                { name: 'Forklift FX-80', status: 'Maintenance', rev: '$640' },
                { name: 'Bulldozer BD-12', status: 'Rented', rev: '$1,890' },
              ].map(row => (
                <div key={row.name} className="hd-table-row">
                  <span className="hd-table-name">{row.name}</span>
                  <span className={`hd-pill hd-pill-${row.status.toLowerCase()}`}>{row.status}</span>
                  <span className="hd-table-rev">{row.rev}</span>
                </div>
              ))}
            </div>
          </div>
          {/* floating badges */}
          <div className="hero-float-badge badge-a">
            <span className="float-icon">✅</span>
            <div>
              <div className="float-title">Rental Completed</div>
              <div className="float-sub">Crane Pro 220 · Just now</div>
            </div>
          </div>
          <div className="hero-float-badge badge-b">
            <span className="float-icon">⚡</span>
            <div>
              <div className="float-title">Revenue Up 18%</div>
              <div className="float-sub">vs last month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS / SOCIAL PROOF ── */}
      <section className="logos-section">
        <p className="logos-label">Trusted by leading equipment businesses</p>
        <div className="logos-row">
          {['AlphaRent Co.', 'IronFleet LLC', 'MachPro Group', 'HeavyWork Inc.', 'SiteGear Ltd.'].map(l => (
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
            {
              icon: '🚜',
              title: 'Smart Fleet Management',
              desc: `Track every machine's availability, location, and status in real time. Instantly know what's rented, idle, or under maintenance.`,
              color: '#96DD99',
            },
            {
              icon: '📋',
              title: 'Seamless Rental Agreements',
              desc: 'Create, manage, and close rental agreements in seconds. Automated billing calculations and balance tracking included.',
              color: '#A5E1A6',
            },
            {
              icon: '👤',
              title: 'Customer Profiles',
              desc: 'Maintain rich customer profiles with contact info, rental history, and CNIC records for full compliance and traceability.',
              color: '#B3E5B3',
            },
            {
              icon: '🔧',
              title: 'Maintenance Logging',
              desc: 'Log service records and repair costs per machine. Stay on top of preventive maintenance to reduce downtime.',
              color: '#C2E9BF',
            },
            {
              icon: '📊',
              title: 'Revenue Analytics',
              desc: 'High-level revenue dashboards with trend analysis, machine-level performance, and balance reconciliation.',
              color: '#D7F5D3',
            },
            {
              icon: '🔐',
              title: 'Role-Based Access',
              desc: `Admin and user roles give your team the right level of access. Secure JWT authentication out of the box.`,
              color: '#96DD99',
            },
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

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">Up and running in minutes</h2>
        <div className="how-steps">
          {[
            { step: '01', title: 'Create Your Account', desc: 'Sign up as Admin or User and configure your organization settings instantly.' },
            { step: '02', title: 'Add Your Machines', desc: 'Register your fleet with capacity, pricing, and location details in one simple form.' },
            { step: '03', title: 'Onboard Customers', desc: 'Build a searchable customer database with all the details you need for compliance.' },
            { step: '04', title: 'Start Renting', desc: 'Assign machines to customers, track agreements, and watch revenue grow automatically.' },
          ].map((s, i) => (
            <div key={s.step} className="how-step">
              <div className="how-step-number">{s.step}</div>
              {i < 3 && <div className="how-step-line" />}
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="stats-section">
        <div className="stats-inner">
          <div className="stats-text">
            <div className="section-label" style={{ color: 'var(--primary)' }}>The Numbers</div>
            <h2 className="section-title" style={{ color: '#fff' }}>Built for scale,<br />trusted by teams</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginTop: '1rem', maxWidth: '340px' }}>
              RentBreaker powers fleets of all sizes — from small rental shops to large equipment companies with hundreds of assets.
            </p>
            <Link to="/signup" className="stats-cta">Start Your Journey →</Link>
          </div>
          <div className="stats-grid">
            {[
              { val: '200+', label: 'Fleet Managers', icon: '👥' },
              { val: '5,000+', label: 'Machines Managed', icon: '🚜' },
              { val: '$2M+', label: 'Revenue Tracked', icon: '💰' },
              { val: '99.9%', label: 'Uptime SLA', icon: '⚡' },
              { val: '14 days', label: 'Free Trial', icon: '🎁' },
              { val: '< 5min', label: 'Setup Time', icon: '🚀' },
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
        <div className="section-label">What Teams Say</div>
        <h2 className="section-title">Loved by fleet managers worldwide</h2>

        <div className="testimonials-grid">
          {[
            {
              quote: "RentBreaker cut our rental processing time by 60%. The dashboard gives us instant visibility into our entire fleet — it's been a game changer.",
              name: 'Hamza Riaz',
              role: 'Fleet Operations Manager, IronFleet LLC',
              avatar: 'H',
            },
            {
              quote: "The maintenance logging feature alone saved us thousands in repair costs. We catch issues before they become expensive problems.",
              name: 'Sara Khan',
              role: 'CEO, AlphaRent Co.',
              avatar: 'S',
            },
            {
              quote: "Finally, a system that's actually built for equipment rental. The billing automation is flawless and our customers love the professionalism.",
              name: 'Umar Siddiqui',
              role: 'Operations Lead, SiteGear Ltd.',
              avatar: 'U',
            },
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
        <p className="cta-sub">Join 200+ equipment businesses using RentBreaker to grow faster and operate smarter.</p>
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
              <a href="#features">Features</a>
              <a href="#stats">Analytics</a>
              <Link to="/signup">Get Started</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Support</div>
              <a href="#">Documentation</a>
              <a href="#">Contact Us</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RentBreaker. All rights reserved.</span>
          <span>Made with 💚 for equipment teams</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
