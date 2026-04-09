import { useState, useEffect } from 'react';
import api from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/reports/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user?.name}! 👋</h1>
      
      <div className="grid">
        <div className="card stat-card stat-card-primary">
          <div className="stat-card-accent"></div>
          <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>🚜 Total Machines</p>
          <h2 style={{ fontSize: '2rem' }}>{stats?.totalMachines || 0}</h2>
        </div>
        <div className="card stat-card stat-card-warning">
          <div className="stat-card-accent"></div>
          <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>📄 Total Rentals</p>
          <h2 style={{ fontSize: '2rem' }}>{stats?.totalRentals || 0}</h2>
        </div>
        <div className="card stat-card stat-card-success">
          <div className="stat-card-accent"></div>
          <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>💰 Total Revenue</p>
          <h2 style={{ fontSize: '2rem', color: '#10b981' }}>${stats?.totalRevenue?.toLocaleString() || 0}</h2>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Quick Actions</h3>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>Manage your rental business efficiently.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => window.location.href='/machines'}>Manage Machines</button>
          <button className="btn" style={{ border: '1px solid var(--border-color)' }} onClick={() => window.location.href='/rentals'}>View Rentals</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
