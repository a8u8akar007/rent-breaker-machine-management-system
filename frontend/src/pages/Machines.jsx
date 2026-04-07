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
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Machines Fleet</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Machine'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card">
          <h3>Add New Machine</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Capacity (kg/tons)</label>
                <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Rent Per Day ($)</label>
                <input type="number" value={formData.rentalPricePerDay} onChange={e => setFormData({...formData, rentalPricePerDay: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Machine</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Rent / Day</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(m => (
              <tr key={m._id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>{m.capacity}</td>
                <td>${m.rentalPricePerDay}</td>
                <td>{m.location}</td>
                <td>
                  <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Machines;
