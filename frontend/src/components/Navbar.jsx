import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-logo">RentBreaker</Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/machines">Machines</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/rentals">Rentals</Link>
        <Link to="/maintenance">Maintenance</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name} ({user.role})</span>
        <button onClick={logout} className="btn" style={{ background: '#f1f5f9', fontSize: '0.875rem' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
