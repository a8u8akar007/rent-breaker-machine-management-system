import { useState, useEffect } from 'react';
import api from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role !== 'admin') {
        setLoading(false);
        return;
      }
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
  }, [user?.role]);

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="container animate-fade">
      <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>Dashboard</h1>
      
      {user?.role === 'admin' ? (
        <>
          <div className="grid">
            <div className="card stat-card">
              <div className="stat-card-accent" style={{ background: 'var(--primary)' }}></div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>🚜 Total Machines</p>
              <h2>{stats?.totalMachines || 0}</h2>
            </div>
            <div className="card stat-card">
              <div className="stat-card-accent" style={{ background: 'var(--warning)' }}></div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>📄 Total Rentals</p>
              <h2>{stats?.totalRentals || 0}</h2>
            </div>
            <div className="card stat-card">
              <div className="stat-card-accent" style={{ background: 'var(--success)' }}></div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>💰 Total Revenue</p>
              <h2 style={{ color: 'var(--success)' }}>${stats?.totalRevenue?.toLocaleString() || 0}</h2>
            </div>
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700 }}>Management Overview</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Comprehensive fleet and revenue management tools.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => window.location.href='/machines'}>Manage Inventory</button>
              <button className="btn" style={{ border: '1px solid var(--border)', fontWeight: 600 }} onClick={() => window.location.href='/rentals'}>Monitor Rentals</button>
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontWeight: 700 }}>Client Portal</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem' }}>Welcome to your Rent Breaker dashboard. Explore our premium machine fleet or check your current rentals.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href='/machines'}>Browse Fleet</button>
            <button className="btn" style={{ border: '1px solid var(--border)', fontWeight: 600 }} onClick={() => window.location.href='/rentals'}>My Activities</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
