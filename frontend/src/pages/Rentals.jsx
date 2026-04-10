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
    <div className="container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: 800 }}>Rentals</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ New Rental'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Initialize New Rental Agreement</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label>Select Asset</label>
                <select value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required>
                  <option value="">Search available machines...</option>
                  {machines.map(m => (
                    <option key={m._id} value={m._id}>{m.name} (${m.rentalPricePerDay}/day)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Customer Profile</label>
                <select value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} required>
                  <option value="">Search customer...</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Commencement Date</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Completion Date</label>
                <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Advance Deposit ($)</label>
                <input type="number" placeholder="e.g. 100" value={formData.advancePayment} onChange={e => setFormData({...formData, advancePayment: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Finalize Agreement</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset Details</th>
                <th>Client</th>
                <th>Agreement Period</th>
                <th>Financials</th>
                <th>Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map(r => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 700 }}>{r.machineId?.name}</td>
                  <td style={{ fontWeight: 600 }}>{r.customerId?.name}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(r.startDate).toLocaleDateString()} — {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>Total: <strong>${r.totalRent}</strong></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Balance: ${r.remainingBalance}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td>
                    {r.status !== 'Completed' && (
                      <button className="btn" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', background: 'var(--primary-extralight)', color: 'var(--primary-hover)', fontWeight: 800 }} onClick={() => completeRental(r._id)}>
                        COMPLETE
                      </button>
                    )}
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

export default Rentals;
