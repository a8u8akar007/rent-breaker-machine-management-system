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
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ New Customer'}
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3>Add New Customer</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>CNIC</label>
                <input type="text" value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register Customer</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>CNIC</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c._id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.cnic}</td>
                <td>{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
