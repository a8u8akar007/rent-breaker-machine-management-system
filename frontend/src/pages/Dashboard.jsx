import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Service from '../api/services';
import '../dashboard.css';

/* ─── Sidebar nav items ─── */
const NAV_ITEMS = [
  { path: '/dashboard',   icon: '▦',  label: 'Overview'    },
  { path: '/machines',    icon: '🚜', label: 'Machines'    },
  { path: '/customers',   icon: '👤', label: 'Customers'   },
  { path: '/rentals',     icon: '📋', label: 'Rentals'     },
  { path: '/maintenance', icon: '🔧', label: 'Maintenance' },
];

/* ─── Tiny sparkline SVG ─── */
const Sparkline = ({ data = [], color }) => {
  if (!data || data.length < 2) return <div style={{width: 80, height: 28, background: 'rgba(0,0,0,0.03)', borderRadius: 4}} />;
  const w = 80, h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

/* ─── Mini bar chart ─── */
const BarChart = ({ data = [], color }) => {
  if (!data || data.length === 0) return <div className="db-empty-chart">No data available for this period</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '80px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '100%',
              height: `${(d.value / max) * 64}px`,
              background: color,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.4s ease',
              opacity: i === data.length - 1 ? 1 : 0.45 + (i / data.length) * 0.5,
            }}
          />
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Ring chart placeholder ─── */
const RingChart = ({ pct = 0, color, label }) => {
  const r = 34, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: 88, height: 88 }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4}
            strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
          {Math.round(pct)}%
        </div>
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>{label}</span>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen]     = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await Service.dashboard.getStats();
        setStats(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Process revenue history for chart
  const barData = (stats?.revenueHistory || []).map(h => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      label: monthNames[h._id.month - 1],
      value: h.revenue / 1000 // In thousands
    };
  });

  // Calculate utilization percentages
  const total = stats?.totalMachines || 0;
  const utiRented = stats?.utilization?.find(u => u._id === 'Rented')?.count || 0;
  const utiMaint  = stats?.utilization?.find(u => u._id === 'Maintenance')?.count || 0;
  const utiIdle   = total - utiRented - utiMaint;

  const quickActions = [
    { icon: '🚜', label: 'Add Machine',   href: '/machines',    color: '#96DD99' },
    { icon: '👤', label: 'New Customer',  href: '/customers',   color: '#A5E1A6' },
    { icon: '📋', label: 'New Rental',    href: '/rentals',     color: '#B3E5B3' },
    { icon: '🔧', label: 'Log Service',   href: '/maintenance', color: '#C2E9BF' },
  ];

  /* ── KPI cards ── */
  const kpis = [
    {
      label: 'Total Machines',
      value: stats?.totalMachines ?? 0,
      icon: '🚜',
      color: '#96DD99',
      trend: 'Operational fleet',
      up: true,
      spark: [10, 12, 11, stats?.totalMachines || 0],
    },
    {
      label: 'Active Rentals',
      value: stats?.activeRentals ?? 0,
      icon: '📋',
      color: '#A5E1A6',
      trend: 'Live agreements',
      up: true,
      spark: [5, 8, 7, stats?.activeRentals || 0],
    },
    {
      label: 'Lifetime Revenue',
      value: stats?.totalRevenue ? `$${(stats.totalRevenue / 1000).toFixed(1)}k` : '$0',
      icon: '💰',
      color: '#5ab85e',
      trend: 'Total billing',
      up: true,
      spark: barData.map(d => d.value),
    },
    {
      label: 'Utilization',
      value: total ? `${Math.round((utiRented / total) * 100)}%` : '0%',
      icon: '📊',
      color: '#B3E5B3',
      trend: 'Rented vs Capacity',
      up: null,
      spark: [40, 52, 48, total ? (utiRented / total) * 100 : 0],
    },
  ];

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="db-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar-open' : 'db-sidebar-closed'}`}>
        <div className="db-sidebar-brand">
          <span className="db-brand-dot" />
          {sidebarOpen && <span className="db-brand-name">RentBreaker</span>}
        </div>

        <nav className="db-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`db-nav-item ${location.pathname === item.path ? 'db-nav-active' : ''}`}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="db-nav-label">{item.label}</span>}
              {location.pathname === item.path && <span className="db-nav-indicator" />}
            </Link>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="db-sidebar-user">
            <div className="db-user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="db-user-info">
              <div className="db-user-name">{user?.name || 'User'}</div>
              <div className="db-user-role">{isAdmin ? '🔐 Admin' : '👤 User'}</div>
            </div>
            <button className="db-user-logout" onClick={logout} title="Logout">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        )}

        <button className="db-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '‹' : '›'}
        </button>
      </aside>

      {/* ══════════ MAIN AREA ══════════ */}
      <div className="db-main">

        <header className="db-topbar">
          <div className="db-topbar-left">
            <h1 className="db-page-title">
              {isAdmin ? 'Admin Overview' : 'Client Portal'}
            </h1>
            <span className="db-breadcrumb">
              Dashboard {isAdmin ? '· Systems Analysis' : '· My Account'}
            </span>
          </div>

          <div className="db-topbar-right">
            <div className="db-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search machines, rentals…" />
            </div>

            <div className="db-topbar-actions">
              <div style={{ position: 'relative' }}>
                <button className="db-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  {stats?.recentActivity?.length > 0 && <span className="db-notif-dot" />}
                </button>
                {notifOpen && (
                  <div className="db-notif-panel">
                    <div className="db-notif-header">Recent Activity <span className="db-notif-count">{stats?.recentActivity?.length || 0}</span></div>
                    {stats?.recentActivity?.slice(0, 4).map((n, i) => (
                      <div key={i} className="db-notif-item">
                        <div className="db-notif-pulse" />
                        <div>
                          <div className="db-notif-text">{n.text}</div>
                          <div className="db-notif-time">{formatTime(n.time)}</div>
                        </div>
                      </div>
                    ))}
                    {!stats?.recentActivity?.length && <div style={{padding:'1rem', textAlign:'center', fontSize:'0.8rem', color:'var(--text-muted)'}}>No recent activity</div>}
                  </div>
                )}
              </div>

              <div className="db-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            </div>
          </div>
        </header>

        <div className="db-content">

          {loading ? (
            <div className="db-loading">
              <div className="db-spinner" />
              <p>Fetching real-time data…</p>
            </div>
          ) : isAdmin ? (
            <>
              {/* ── KPI Cards ── */}
              <div className="db-kpi-grid">
                {kpis.map((k, i) => (
                  <div key={i} className="db-kpi-card" style={{ '--kpi-color': k.color }}>
                    <div className="db-kpi-top">
                      <div className="db-kpi-icon" style={{ background: k.color + '22', border: `1px solid ${k.color}55` }}>
                        {k.icon}
                      </div>
                      <div className="db-kpi-spark">
                        <Sparkline data={k.spark} color={k.color} />
                      </div>
                    </div>
                    <div className="db-kpi-value">{k.value}</div>
                    <div className="db-kpi-label">{k.label}</div>
                    <div className={`db-kpi-trend ${k.up === true ? 'trend-up' : k.up === false ? 'trend-down' : 'trend-neutral'}`}>
                      {k.up === true ? '↑' : k.up === false ? '↓' : '•'} {k.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Charts row ── */}
              <div className="db-mid-grid">
                <div className="db-panel db-panel-lg">
                  <div className="db-panel-header">
                    <div>
                      <div className="db-panel-title">Revenue Trends</div>
                      <div className="db-panel-sub">Monthly comparison of completed rentals ($k)</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <BarChart data={barData} color="var(--primary)" />
                  </div>
                </div>

                <div className="db-panel">
                  <div className="db-panel-header">
                    <div>
                      <div className="db-panel-title">Fleet Utilization</div>
                      <div className="db-panel-sub">Live status distribution</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1.5rem' }}>
                    <RingChart pct={total ? (utiRented / total) * 100 : 0} color="#96DD99" label="Rented" />
                    <RingChart pct={total ? (utiMaint / total) * 100 : 0} color="#ffa726" label="In Service" />
                    <RingChart pct={total ? (utiIdle / total) * 100 : 0} color="#e0e0e0" label="Idle" />
                  </div>
                </div>
              </div>

              {/* ── Bottom row ── */}
              <div className="db-bot-grid">
                <div className="db-panel db-panel-lg">
                  <div className="db-panel-header">
                    <div>
                      <div className="db-panel-title">Recent Activity</div>
                      <div className="db-panel-sub">Consolidated event stream from all modules</div>
                    </div>
                    <span className="db-live-badge">● LIVE DATA</span>
                  </div>
                  <div className="db-activity-list">
                    {stats?.recentActivity?.length > 0 ? stats.recentActivity.map((a, i) => (
                      <div key={i} className="db-activity-item">
                        <div className={`db-activity-icon db-activity-${a.type}`}>{a.icon}</div>
                        <div className="db-activity-body">
                          <div className="db-activity-text">{a.text}</div>
                          <div className="db-activity-time">{formatTime(a.time)}</div>
                        </div>
                        <div className="db-activity-line" />
                      </div>
                    )) : (
                      <div className="db-empty-state">No recent activity found in the system.</div>
                    )}
                  </div>
                </div>

                <div className="db-panel">
                  <div className="db-panel-header">
                    <div>
                      <div className="db-panel-title">Quick Actions</div>
                      <div className="db-panel-sub">Direct access to core modules</div>
                    </div>
                  </div>
                  <div className="db-quick-grid">
                    {quickActions.map(a => (
                      <Link key={a.label} to={a.href} className="db-quick-card" style={{ '--qa-color': a.color }}>
                        <div className="db-quick-icon" style={{ background: a.color + '25', border: `1px solid ${a.color}55` }}>
                          {a.icon}
                        </div>
                        <div className="db-quick-label">{a.label}</div>
                        <div className="db-quick-arrow">→</div>
                      </Link>
                    ))}
                  </div>

                  <div className="db-health">
                    <div className="db-health-title">Inventory Health</div>
                    {[
                      { label: 'Fleet Availability', pct: total ? (utiIdle / total) * 100 : 0, color: '#96DD99' },
                      { label: 'Rental Conversion', pct: total ? (utiRented / total) * 100 : 0, color: '#A5E1A6' },
                      { label: 'Maintenance Ratio', pct: total ? (utiMaint / total) * 100 : 0, color: '#ffa726' },
                    ].map(h => (
                      <div key={h.label} className="db-health-row">
                        <span className="db-health-label">{h.label}</span>
                        <div className="db-health-bar-bg">
                          <div className="db-health-bar-fill" style={{ width: `${Math.min(h.pct, 100)}%`, background: h.color }} />
                        </div>
                        <span className="db-health-pct">{Math.round(h.pct)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ════ USER PORTAL ════ */
            <div className="db-user-portal">
              <div className="db-portal-hero">
                <div className="db-portal-orb" />
                <h2 className="db-portal-title">
                  Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0]}</span> 👋
                </h2>
                <p className="db-portal-sub">
                  Your personalized dashboard is live. You have <strong>{stats?.activeRentals || 0}</strong> active rentals.
                </p>
                <div className="db-portal-actions">
                  <Link to="/machines" className="db-portal-btn-primary">Browse Catalog →</Link>
                  <Link to="/rentals"  className="db-portal-btn-ghost">Active Rentals</Link>
                </div>
              </div>

              <div className="db-portal-cards">
                {[
                  { icon: '🚜', title: 'Machine Catalog',  desc: `${stats?.totalMachines || 0} machines available`, href: '/machines',    color: '#96DD99' },
                  { icon: '📋', title: 'My Center',        desc: 'Manage your rental agreements',   href: '/rentals',     color: '#A5E1A6' },
                  { icon: '🔧', title: 'Support',          desc: 'Request service or assistance',    href: '/maintenance', color: '#B3E5B3' },
                ].map(c => (
                  <Link key={c.title} to={c.href} className="db-portal-card" style={{ '--pc-color': c.color }}>
                    <div className="db-portal-card-icon" style={{ background: c.color + '22', border: `1px solid ${c.color}66` }}>
                      {c.icon}
                    </div>
                    <div className="db-portal-card-title">{c.title}</div>
                    <div className="db-portal-card-desc">{c.desc}</div>
                    <div className="db-portal-card-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
