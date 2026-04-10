import { useState, useEffect, useMemo } from 'react';
import Service from '../api/services';
import '../mgmt.css';

const PAGE_SIZE = 8;

const Field = ({ label, required, optional, helper, error, valid, icon, children, className = '' }) => (
  <div className={`pf ${error ? 'pf-error' : valid ? 'pf-valid' : ''} ${className}`}>
    <div className="pf-label-row">
      <label className="pf-label">
        {label}
        {required && <span className="pf-required">*</span>}
        {optional && <span className="pf-optional">optional</span>}
      </label>
    </div>
    <div className={`pf-wrap ${icon ? 'pf-has-icon' : ''}`}>
      {icon && <span className="pf-icon">{icon}</span>}
      {children}
      {valid && !error && <span className="pf-valid-check">✓</span>}
    </div>
    {error && <div className="pf-error-msg">⚠ {error}</div>}
    {helper && !error && <div className="pf-helper">{helper}</div>}
  </div>
);

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [fd, setFd]               = useState({ name: '', email: '', phone: '', cnic: '', address: '' });
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [formAlert, setFormAlert] = useState(null);
  const user    = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await Service.customers.get();
      setCustomers(data);
    } catch (e) {
      console.error(e);
      setFormAlert('Failed to synchronize customer directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const validate = (d) => {
    const e = {};
    if (!d.name.trim())  e.name  = 'Full name is required';
    else if (d.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email address';
    if (d.phone && !/^[0-9+\-\s()]{7,15}$/.test(d.phone)) e.phone = 'Enter a valid phone number';
    if (d.cnic && !/^\d{5}-\d{7}-\d$/.test(d.cnic)) e.cnic = 'Format: 35200-1234567-8';
    return e;
  };

  const handleBlur  = (f)     => { setTouched(t => ({...t, [f]: true})); setErrors(validate(fd)); };
  const handleChange = (f, v) => { const n = {...fd, [f]: v}; setFd(n); if (touched[f]) setErrors(validate(n)); };
  const isValid      = (f)    => touched[f] && !errors[f] && fd[f];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const all = { name:true, email:true, phone:true, cnic:true };
    setTouched(all);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true); setFormAlert(null);
    try {
      await Service.customers.create(fd);
      setShowForm(false); setFd({ name:'',email:'',phone:'',cnic:'',address:'' });
      setErrors({}); setTouched({}); fetchCustomers();
    } catch (err) { setFormAlert(err.response?.data?.message || 'Failed to register customer.'); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => { setShowForm(false); setFd({ name:'',email:'',phone:'',cnic:'',address:'' }); setErrors({}); setTouched({}); setFormAlert(null); };

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q) || c.cnic?.includes(q));
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const initials = (n) => n?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || '?';
  const colors = ['#96DD99','#A5E1A6','#B3E5B3','#80CBC4','#AED581'];

  return (
    <div className="mgmt-root">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h1 className="mgmt-title">👤 Customer Directory</h1>
          <p className="mgmt-subtitle">Manage client profiles, contacts and rental history</p>
        </div>
        {isAdmin && (
          <button className={`mgmt-add-btn ${showForm ? 'mgmt-add-btn-cancel' : ''}`} onClick={() => showForm ? resetForm() : setShowForm(true)}>
            {showForm ? '✕ Cancel' : '+ Add Customer'}
          </button>
        )}
      </div>

      {/* ── Premium Form ── */}
      {showForm && (
        <div className="mgmt-drawer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="mgmt-drawer-title" style={{ marginBottom: '0.2rem' }}>Register New Customer</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Build a complete profile for compliance and easy lookup</div>
            </div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', padding:'0.3rem 0.7rem', background:'#f4f7f4', borderRadius:'100px', border:'1px solid var(--border)' }}>
              <span style={{ color:'#ef4444' }}>*</span> Required fields
            </div>
          </div>

          {formAlert && (
            <div className="pf-form-alert pf-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {formAlert}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1 — Personal */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">👤</div>
                <span className="form-section-title">Personal Information</span>
              </div>
              <div className="form-grid-2">
                <Field label="Full Name" required error={touched.name && errors.name} valid={isValid('name')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
                  <input className="pf-input" placeholder="e.g. Hamza Riaz" value={fd.name}
                    onChange={e => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} />
                </Field>
                <Field label="Email Address" optional error={touched.email && errors.email} valid={isValid('email')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}>
                  <input className="pf-input" type="email" placeholder="hamza@company.com" value={fd.email}
                    onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} />
                </Field>
              </div>
            </div>

            {/* Section 2 — Contact & ID */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">📋</div>
                <span className="form-section-title">Contact & Identification</span>
              </div>
              <div className="form-grid-2">
                <Field label="Phone Number" optional error={touched.phone && errors.phone} valid={isValid('phone')}
                  helper="Include country code e.g. +92 300 0000000"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}>
                  <input className="pf-input" type="tel" placeholder="+92 300 0000000" value={fd.phone}
                    onChange={e => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} />
                </Field>
                <Field label="CNIC Number" optional error={touched.cnic && errors.cnic} valid={isValid('cnic')}
                  helper="Format: 35200-1234567-8"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}>
                  <input className="pf-input" placeholder="35200-1234567-8" value={fd.cnic}
                    onChange={e => handleChange('cnic', e.target.value)} onBlur={() => handleBlur('cnic')} />
                </Field>
              </div>
            </div>

            {/* Section 3 — Address */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">📍</div>
                <span className="form-section-title">Address</span>
                <span className="form-section-sub">Optional</span>
              </div>
              <Field label="Full Address" optional
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}>
                <input className="pf-input" placeholder="Street, City, Province" value={fd.address}
                  onChange={e => handleChange('address', e.target.value)} />
              </Field>
            </div>

            <div className="pf-submit-zone">
              <button type="submit" className="pf-submit-btn pf-btn-green" disabled={submitting}>
                {submitting ? <><span className="pf-spinner" />Registering…</> : <>Register Customer →</>}
              </button>
              <button type="button" className="pf-cancel-btn" onClick={resetForm}>Cancel</button>
              <span className="pf-form-note">Customer data stored securely</span>
            </div>
          </form>
        </div>
      )}

      {/* Stat */}
      <div className="mgmt-stat-bar">
        {[
          { label: 'Total Clients', val: customers.length, color: '#96DD99' },
          { label: 'This Month',    val: customers.filter(c => { const d=new Date(c.createdAt),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length, color: '#A5E1A6' },
        ].map(s => (
          <div key={s.label} className="mgmt-stat-chip" style={{ '--chip-color': s.color }}>
            <div className="mgmt-stat-chip-val">{s.val}</div>
            <div className="mgmt-stat-chip-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mgmt-toolbar">
        <div className="mgmt-search-wrap">
          <span className="mgmt-search-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input className="mgmt-search" placeholder="Search by name, email, phone, CNIC…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <span className="mgmt-count-chip">{filtered.length} customer{filtered.length!==1?'s':''}</span>
      </div>

      {/* Table */}
      <div className="mgmt-table-card">
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead><tr><th>Customer</th><th>Contact</th><th>CNIC</th><th>Address</th><th>Joined</th></tr></thead>
            <tbody>
              {loading ? [1,2,3].map(i=><tr key={i} className="mgmt-skeleton-row">{[70,60,50,80,40].map((w,j)=><td key={j}><div className="mgmt-skeleton" style={{width:`${w}%`}}/></td>)}</tr>)
              : paged.length===0 ? <tr><td colSpan={5}><div className="mgmt-empty"><div className="mgmt-empty-icon">👤</div><div className="mgmt-empty-title">No customers found</div><div className="mgmt-empty-sub">{search?'Try a different term.':'Add your first customer.'}</div>{isAdmin&&!search&&<button className="mgmt-add-btn" onClick={()=>setShowForm(true)}>+ Add Customer</button>}</div></td></tr>
              : paged.map((c,idx) => (
                <tr key={c._id}>
                  <td><div className="mgmt-row-avatar"><div className="mgmt-avatar-icon" style={{background:colors[idx%colors.length]+'55',border:`1px solid ${colors[idx%colors.length]}88`,fontSize:'0.72rem',fontWeight:800,color:'#1a2e1b'}}>{initials(c.name)}</div><div><div className="mgmt-avatar-name">{c.name}</div><div className="mgmt-avatar-sub">{c.email||'—'}</div></div></div></td>
                  <td><span style={{display:'inline-flex',alignItems:'center',gap:'0.35rem',fontSize:'0.82rem',color:'var(--text-muted)'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>{c.phone||'—'}</span></td>
                  <td className="mgmt-cell-mono">{c.cnic||'—'}</td>
                  <td className="mgmt-cell-muted">{c.address||'—'}</td>
                  <td className="mgmt-cell-muted">{c.createdAt?new Date(c.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages>1 && (
          <div className="mgmt-pagination">
            <span className="mgmt-page-info">Showing <strong>{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)}</strong> of <strong>{filtered.length}</strong></span>
            <div className="mgmt-page-btns">
              <button className="mgmt-page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=><button key={p} className={`mgmt-page-btn ${p===page?'mgmt-page-btn-active':''}`} onClick={()=>setPage(p)}>{p}</button>)}
              <button className="mgmt-page-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
