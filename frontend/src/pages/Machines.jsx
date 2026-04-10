import { useState, useEffect } from 'react';
import api from '../api/api';

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', capacity: '', rentalPricePerDay: '', location: '', status: 'Available'
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchMachines = async () => {
    try {
      const { data } = await api.get('/machines');
      setMachines(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMachines(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/machines', formData);
      setShowAddForm(false);
      setFormData({ name: '', capacity: '', rentalPricePerDay: '', location: '', status: 'Available' });
      fetchMachines();
    } catch (err) { alert(err.response?.data?.message || 'Error adding machine'); }
  };

  return (
    <div className="container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: 800 }}>Machine Fleet</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Machine'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Provision New Machine</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label>Identifier Name</label>
                <input type="text" placeholder="e.g. Excavator XT-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Operational Capacity</label>
                <input type="text" placeholder="e.g. 50 Tons" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Daily Rental Rate ($)</label>
                <input type="number" placeholder="250" value={formData.rentalPricePerDay} onChange={e => setFormData({...formData, rentalPricePerDay: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Current Deployment Location</label>
                <input type="text" placeholder="e.g. Site A" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Deploy Machine</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Machine Details</th>
                <th>Capacity</th>
                <th>Daily Rate</th>
                <th>Current Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {machines.map(m => (
                <tr key={m._id}>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{m.name}</td>
                  <td>{m.capacity}</td>
                  <td style={{ fontWeight: 600 }}>${m.rentalPricePerDay}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{m.location}</td>
                  <td>
                    <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Machines;
