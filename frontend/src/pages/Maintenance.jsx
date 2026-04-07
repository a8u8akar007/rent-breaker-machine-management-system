import { useState, useEffect } from 'react';
import api from '../api/api';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ machineId: '', issue: '', cost: '', date: '' });
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    try {
      const [r, m] = await Promise.all([
        api.get('/maintenance'),
        api.get('/machines')
      ]);
      setRecords(r.data);
      setMachines(m.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/maintenance', formData);
      setShowAddForm(false);
      setFormData({ machineId: '', issue: '', cost: '', date: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error adding record'); }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Maintenance Logs</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Log Maintenance'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card">
          <h3>Log Maintenance Record</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="grid">
              <div className="form-group">
                <label>Machine</label>
                <select value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required>
                  <option value="">Choose machine...</option>
                  {machines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Issue Description</label>
                <input type="text" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Repair Cost ($)</label>
                <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Log</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Machine</th>
              <th>Date</th>
              <th>Issue</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id}>
                <td style={{ fontWeight: 600 }}>{r.machineId?.name}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.issue}</td>
                <td style={{ color: '#ef4444' }}>-${r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
