import { useState, useEffect } from 'react';
import api from '../api/api';

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [machines, setMachines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ machineId: '', customerId: '', startDate: '', endDate: '', advancePayment: 0 });

  const fetchData = async () => {
    try {
      const [r, m, c] = await Promise.all([
        api.get('/rentals'),
        api.get('/machines'),
        api.get('/customers')
      ]);
      setRentals(r.data);
      setMachines(m.data.filter(mat => mat.status === 'Available'));
      setCustomers(c.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rentals', formData);
      setShowAddForm(false);
      setFormData({ machineId: '', customerId: '', startDate: '', endDate: '', advancePayment: 0 });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error creating rental'); }
  };

  const completeRental = async (id) => {
    try {
      await api.put(`/rentals/${id}`, { status: 'Completed' });
      fetchData();
    } catch (err) { alert('Error completing rental'); }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Rentals</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ New Rental'}
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3>Process New Rental</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="grid">
              <div className="form-group">
                <label>Select Machine</label>
                <select value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required>
                  <option value="">Choose a machine...</option>
                  {machines.map(m => (
                    <option key={m._id} value={m._id}>{m.name} (${m.rentalPricePerDay}/day)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Customer</label>
                <select value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} required>
                  <option value="">Choose a customer...</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Advance Payment ($)</label>
                <input type="number" value={formData.advancePayment} onChange={e => setFormData({...formData, advancePayment: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Confirm Rental</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Machine</th>
              <th>Customer</th>
              <th>Period</th>
              <th>Finances</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(r => (
              <tr key={r._id}>
                <td>{r.machineId?.name}</td>
                <td>{r.customerId?.name}</td>
                <td style={{ fontSize: '0.875rem' }}>
                  {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem' }}>Total: <strong>${r.totalRent}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Balance: ${r.remainingBalance}</div>
                </td>
                <td>
                  <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                </td>
                <td>
                  {r.status !== 'Completed' && (
                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9' }} onClick={() => completeRental(r._id)}>
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rentals;
