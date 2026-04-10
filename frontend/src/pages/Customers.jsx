import { useState, useEffect } from 'react';
import api from '../api/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', cnic: '', address: '' });

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      setShowAddForm(false);
      setFormData({ name: '', phone: '', cnic: '', address: '' });
      fetchCustomers();
    } catch (err) { alert(err.response?.data?.message || 'Error adding customer'); }
  };

  return (
    <div className="container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: 800 }}>Customers</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ New Customer'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Register New Customer</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. Jane Smith" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>CNIC / ID Number</label>
                <input type="text" placeholder="12345-6789012-3" value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Residential Address</label>
                <input type="text" placeholder="Street, City, Zip" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register Profile</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Number</th>
                <th>Identity (CNIC)</th>
                <th>Primary Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{c.name}</td>
                  <td style={{ fontWeight: 600 }}>{c.phone}</td>
                  <td>{c.cnic}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
