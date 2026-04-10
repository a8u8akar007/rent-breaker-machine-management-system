import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Hide the app navbar on the public landing page or auth pages
  if (!user || ['/', '/login', '/signup'].includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-logo">
        RentBreaker
      </Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/machines">Machines</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/rentals">Rentals</Link>
        <Link to="/maintenance">Maintenance</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {user.name}
        </span>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--primary-extralight)', color: '#2e7d32', padding: '0.2rem 0.6rem', borderRadius: '100px', textTransform: 'capitalize' }}>
          {user.role}
        </span>
        <button onClick={logout} className="btn" style={{ background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
