import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../dashboard.css';

const NAV_ITEMS = [
  { path: '/dashboard',   icon: '▦',  label: 'Overview'    },
  { path: '/machines',    icon: '🚜', label: 'Machines'    },
  { path: '/customers',   icon: '👤', label: 'Customers'   },
  { path: '/rentals',     icon: '📋', label: 'Rentals'     },
  { path: '/maintenance', icon: '🔧', label: 'Maintenance' },
];

const AppShell = ({ children, title, subtitle }) => {
  const location = useLocation();
  const navigate  = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="db-root">
      {/* Sidebar */}
      <aside className="db-sidebar db-sidebar-open">
        <div className="db-sidebar-brand">
          <span className="db-brand-dot" />
          <span className="db-brand-name">RentBreaker</span>
        </div>
        <nav className="db-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`db-nav-item ${location.pathname === item.path ? 'db-nav-active' : ''}`}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {location.pathname === item.path && <span className="db-nav-indicator" />}
            </Link>
          ))}
        </nav>
        <div className="db-sidebar-user">
          <div className="db-user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="db-user-info">
            <div className="db-user-name">{user?.name || 'User'}</div>
            <div className="db-user-role">{user?.role === 'admin' ? '🔐 Admin' : '👤 User'}</div>
          </div>
          <button className="db-user-logout" onClick={logout} title="Logout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="db-main">
        {/* Topbar */}
        <header className="db-topbar">
          <div className="db-topbar-left">
            <h1 className="db-page-title">{title}</h1>
            {subtitle && <span className="db-breadcrumb">{subtitle}</span>}
          </div>
          <div className="db-topbar-right">
            <div className="db-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="db-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
