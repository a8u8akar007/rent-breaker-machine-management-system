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
    <div className="container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: 800 }}>Maintenance Logs</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Log Issue'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Report Service Requirement</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label>Asset Under Service</label>
                <select value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required>
                  <option value="">Search machine...</option>
                  {machines.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Service Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Service Cost ($)</label>
                <input type="number" placeholder="50.00" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Issue Description</label>
              <textarea placeholder="Provide detailed operational issues..." value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', background: 'var(--warning)', borderColor: 'var(--warning)' }}>Log Service Record</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Service Date</th>
                <th>Machine</th>
                <th>Issue Reported</th>
                <th>Maintenance Cost</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>{new Date(r.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 700 }}>{r.machineId?.name}</td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>{r.issue}</td>
                  <td style={{ fontWeight: 700, color: 'var(--danger)' }}>${r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
