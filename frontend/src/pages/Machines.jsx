import { useState, useEffect, useMemo } from 'react';
import Service from '../api/services';
import '../mgmt.css';

const PAGE_SIZE = 8;

/* ── Field Component ── */
const Field = ({ label, required, optional, helper, error, valid, icon, suffix, children, className = '' }) => (
  <div className={`pf ${error ? 'pf-error' : valid ? 'pf-valid' : ''} ${className}`}>
    <div className="pf-label-row">
      <label className="pf-label">
        {label}
        {required && <span className="pf-required">*</span>}
        {optional && <span className="pf-optional">optional</span>}
      </label>
    </div>
    <div className={`pf-wrap ${icon ? 'pf-has-icon' : ''} ${suffix ? 'pf-has-suffix' : ''}`}>
      {icon && <span className="pf-icon">{icon}</span>}
      {children}
      {suffix && <span className="pf-suffix">{suffix}</span>}
      {valid && !error && <span className="pf-valid-check">✓</span>}
    </div>
    {error && <div className="pf-error-msg">⚠ {error}</div>}
    {helper && !error && <div className="pf-helper">{helper}</div>}
  </div>
);

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [page, setPage]         = useState(1);
  const [formData, setFormData] = useState({ name: '', capacity: '', rentalPricePerDay: '', location: '', status: 'Available' });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [formAlert, setFormAlert] = useState(null);
  const user    = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const { data } = await Service.machines.get();
      setMachines(data);
    } catch (e) {
      console.error(e);
      setFormAlert('Failed to load machines. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMachines(); }, []);

  /* Validation */
  const validate = (data) => {
    const e = {};
    if (!data.name.trim()) e.name = 'Machine name is required';
    else if (data.name.length < 3) e.name = 'Name must be at least 3 characters';
    if (!data.capacity.trim()) e.capacity = 'Capacity is required (e.g. 50 Tons)';
    if (!data.rentalPricePerDay) e.rentalPricePerDay = 'Daily rate is required';
    else if (Number(data.rentalPricePerDay) <= 0) e.rentalPricePerDay = 'Rate must be greater than 0';
    if (!data.location.trim()) e.location = 'Deployment location is required';
    return e;
  };

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (field, val) => {
    const next = { ...formData, [field]: val };
    setFormData(next);
    if (touched[field]) setErrors(validate(next));
  };

  const isValid = (f) => touched[f] && !errors[f] && formData[f];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, capacity: true, rentalPricePerDay: true, location: true };
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setFormAlert(null);
    try {
      await Service.machines.create(formData);
      setShowForm(false);
      setFormData({ name: '', capacity: '', rentalPricePerDay: '', location: '', status: 'Available' });
      setErrors({}); setTouched({});
      fetchMachines();
    } catch (err) {
      setFormAlert(err.response?.data?.message || 'Failed to add machine. Please try again.');
    } finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setShowForm(false); setFormData({ name: '', capacity: '', rentalPricePerDay: '', location: '', status: 'Available' });
    setErrors({}); setTouched({}); setFormAlert(null);
  };

  const filtered = useMemo(() => {
    let d = machines;
    if (filter !== 'All') d = d.filter(m => m.status === filter);
    if (search) d = d.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.location?.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [machines, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const statusIcon = { Available: '🟢', Rented: '🔴', Maintenance: '🟠' };

  return (
    <div className="mgmt-root">
      {/* Header */}
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h1 className="mgmt-title">🚜 Machine Fleet</h1>
          <p className="mgmt-subtitle">Manage, monitor and provision your equipment inventory</p>
        </div>
        {isAdmin && (
          <button className={`mgmt-add-btn ${showForm ? 'mgmt-add-btn-cancel' : ''}`} onClick={() => showForm ? resetForm() : setShowForm(true)}>
            {showForm ? '✕ Cancel' : '+ Add Machine'}
          </button>
        )}
      </div>

      {/* ── PREMIUM FORM ── */}
      {showForm && (
        <div className="mgmt-drawer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="mgmt-drawer-title" style={{ marginBottom: '0.2rem' }}>Provision New Machine</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fill in all required details to deploy a machine to your fleet</div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.3rem 0.7rem', background: '#f4f7f4', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <span style={{ color: '#ef4444' }}>*</span> Required fields
            </div>
          </div>

          {formAlert && (
            <div className="pf-form-alert pf-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {formAlert}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1 — Identity */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">🏷</div>
                <span className="form-section-title">Machine Identity</span>
              </div>
              <div className="form-grid-2">
                <Field label="Machine Name" required error={touched.name && errors.name} valid={isValid('name')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}>
                  <input className="pf-input" placeholder="e.g. Excavator XT-500" value={formData.name}
                    onChange={e => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} />
                </Field>
                <Field label="Operational Capacity" required error={touched.capacity && errors.capacity} valid={isValid('capacity')}
                  helper="Weight, volume, or power rating"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}>
                  <input className="pf-input" placeholder="e.g. 50 Tons" value={formData.capacity}
                    onChange={e => handleChange('capacity', e.target.value)} onBlur={() => handleBlur('capacity')} />
                </Field>
              </div>
            </div>

            {/* Section 2 — Financial & Location */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">📍</div>
                <span className="form-section-title">Deployment & Pricing</span>
              </div>
              <div className="form-grid-3">
                <Field label="Daily Rental Rate" required error={touched.rentalPricePerDay && errors.rentalPricePerDay} valid={isValid('rentalPricePerDay')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                  suffix="/day">
                  <input className="pf-input" type="number" min="1" placeholder="250" value={formData.rentalPricePerDay}
                    onChange={e => handleChange('rentalPricePerDay', e.target.value)} onBlur={() => handleBlur('rentalPricePerDay')} />
                </Field>
                <Field label="Current Location" required error={touched.location && errors.location} valid={isValid('location')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                  className="form-col-span-2">
                  <input className="pf-input" placeholder="e.g. Site A, Lahore" value={formData.location}
                    onChange={e => handleChange('location', e.target.value)} onBlur={() => handleBlur('location')} />
                </Field>
              </div>
            </div>

            {/* Section 3 — Status */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">🔘</div>
                <span className="form-section-title">Initial Status</span>
              </div>
              <div className="pf-option-grid">
                {[
                  { val: 'Available', icon: '🟢', desc: 'Ready to rent' },
                  { val: 'Maintenance', icon: '🟠', desc: 'Under service' },
                ].map(opt => (
                  <button key={opt.val} type="button"
                    className={`pf-option-card ${formData.status === opt.val ? 'pf-option-card-active' : ''}`}
                    onClick={() => handleChange('status', opt.val)}>
                    <span className="pf-option-icon">{opt.icon}</span>
                    <div>
                      <div className="pf-option-title">{opt.val}</div>
                      <div className="pf-option-desc">{opt.desc}</div>
                    </div>
                    {formData.status === opt.val && <span className="pf-option-tick">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="pf-submit-zone">
              <button type="submit" className="pf-submit-btn pf-btn-green" disabled={submitting}>
                {submitting ? <><span className="pf-spinner" />Deploying…</> : <>Deploy Machine →</>}
              </button>
              <button type="button" className="pf-cancel-btn" onClick={resetForm}>Cancel</button>
              <span className="pf-form-note">All required fields must be filled</span>
            </div>
          </form>
        </div>
      )}

      {/* Stat chips */}
      <div className="mgmt-stat-bar">
        {[
          { label: 'Total',       val: machines.length,                                         color: '#96DD99' },
          { label: 'Available',   val: machines.filter(m => m.status === 'Available').length,   color: '#86efac' },
          { label: 'Rented',      val: machines.filter(m => m.status === 'Rented').length,      color: '#fca5a5' },
          { label: 'Maintenance', val: machines.filter(m => m.status === 'Maintenance').length, color: '#fcd34d' },
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
          <input className="mgmt-search" placeholder="Search by name or location…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="mgmt-filter-select" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          {['All', 'Available', 'Rented', 'Maintenance'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="mgmt-count-chip">{filtered.length} machine{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="mgmt-table-card">
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead><tr><th>Machine</th><th>Capacity</th><th>Daily Rate</th><th>Location</th><th>Status</th></tr></thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="mgmt-skeleton-row">
                    {[80,50,60,90,70].map((w,j) => <td key={j}><div className="mgmt-skeleton" style={{ width: `${w}%` }} /></td>)}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="mgmt-empty">
                    <div className="mgmt-empty-icon">🚜</div>
                    <div className="mgmt-empty-title">No machines found</div>
                    <div className="mgmt-empty-sub">{search || filter !== 'All' ? 'Try adjusting your search or filter.' : 'Add your first machine to get started.'}</div>
                    {isAdmin && !search && filter === 'All' && <button className="mgmt-add-btn" onClick={() => setShowForm(true)}>+ Add Machine</button>}
                  </div>
                </td></tr>
              ) : paged.map(m => (
                <tr key={m._id}>
                  <td>
                    <div className="mgmt-row-avatar">
                      <div className="mgmt-avatar-icon">{statusIcon[m.status] || '🚜'}</div>
                      <div><div className="mgmt-avatar-name">{m.name}</div><div className="mgmt-avatar-sub">#{m._id.slice(-6).toUpperCase()}</div></div>
                    </div>
                  </td>
                  <td className="mgmt-cell-muted">{m.capacity}</td>
                  <td className="mgmt-cell-money">${m.rentalPricePerDay}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/day</span></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{m.location}</span></td>
                  <td><span className={`mgmt-badge mgmt-badge-${m.status.toLowerCase()}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mgmt-pagination">
            <span className="mgmt-page-info">Showing <strong>{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong></span>
            <div className="mgmt-page-btns">
              <button className="mgmt-page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=><button key={p} className={`mgmt-page-btn ${p===page?'mgmt-page-btn-active':''}`} onClick={()=>setPage(p)}>{p}</button>)}
              <button className="mgmt-page-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Machines;
