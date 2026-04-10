import { useState, useEffect, useMemo } from 'react';
import Service from '../api/services';
import '../mgmt.css';

const PAGE_SIZE = 8;

const Field = ({ label, required, optional, helper, error, valid, icon, children, className='' }) => (
  <div className={`pf ${error?'pf-error':valid?'pf-valid':''} ${className}`}>
    <div className="pf-label-row">
      <label className="pf-label">{label}{required&&<span className="pf-required">*</span>}{optional&&<span className="pf-optional">optional</span>}</label>
    </div>
    <div className={`pf-wrap ${icon?'pf-has-icon':''}`}>
      {icon&&<span className="pf-icon">{icon}</span>}
      {children}
      {valid&&!error&&<span className="pf-valid-check">✓</span>}
    </div>
    {error&&<div className="pf-error-msg">⚠ {error}</div>}
    {helper&&!error&&<div className="pf-helper">{helper}</div>}
  </div>
);

const Rentals = () => {
  const [rentals, setRentals]     = useState([]);
  const [machines, setMachines]   = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [page, setPage]           = useState(1);
  const [fd, setFd]               = useState({ machineId:'', customerId:'', startDate:'', endDate:'', advancePayment:0 });
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [formAlert, setFormAlert] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, m, c] = await Promise.all([
        Service.rentals.get(),
        Service.machines.get(),
        Service.customers.get()
      ]);
      setRentals(r.data);
      setMachines(m.data.filter(x => x.status === 'Available'));
      setCustomers(c.data);
    } catch(e) {
      console.error(e);
      setFormAlert('Connectivity error. Data could not be synchronized.');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const validate = (d) => {
    const e = {};
    if (!d.machineId)   e.machineId   = 'Please select a machine';
    if (!d.customerId)  e.customerId  = 'Please select a customer';
    if (!d.startDate)   e.startDate   = 'Start date is required';
    if (!d.endDate)     e.endDate     = 'End date is required';
    else if (d.startDate && d.endDate && new Date(d.endDate) <= new Date(d.startDate))
                        e.endDate     = 'End date must be after start date';
    if (d.advancePayment < 0) e.advancePayment = 'Advance payment cannot be negative';
    return e;
  };

  const handleBlur  = (f)    => { setTouched(t=>({...t,[f]:true})); setErrors(validate(fd)); };
  const handleChange = (f,v) => { const n={...fd,[f]:v}; setFd(n); if(touched[f]) setErrors(validate(n)); };
  const isValid      = (f)   => touched[f]&&!errors[f]&&fd[f];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const all={machineId:true,customerId:true,startDate:true,endDate:true};
    setTouched(all);
    const errs=validate(fd); setErrors(errs);
    if(Object.keys(errs).length>0) return;
    setSubmitting(true); setFormAlert(null);
    try {
      await Service.rentals.create(fd);
      setShowForm(false); setFd({machineId:'',customerId:'',startDate:'',endDate:'',advancePayment:0});
      setErrors({}); setTouched({}); fetchData();
    } catch(err) { setFormAlert(err.response?.data?.message||'Failed to create rental.'); }
    finally { setSubmitting(false); }
  };

  const completeRental = async (id) => {
    if(!window.confirm('Mark this rental as completed?')) return;
    try {
      await Service.rentals.update(id, {status:'Completed'});
      fetchData();
    } catch(e) {
      alert(e.response?.data?.message || 'Error completing rental');
    }
  };

  const resetForm = () => { setShowForm(false); setFd({machineId:'',customerId:'',startDate:'',endDate:'',advancePayment:0}); setErrors({}); setTouched({}); setFormAlert(null); };

  const filtered = useMemo(() => {
    let d = rentals;
    if (filter!=='All') d=d.filter(r=>r.status===filter);
    if (search) { const q=search.toLowerCase(); d=d.filter(r=>r.machineId?.name?.toLowerCase().includes(q)||r.customerId?.name?.toLowerCase().includes(q)); }
    return d;
  }, [rentals, search, filter]);

  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalRevenue = rentals.reduce((s,r)=>s+(r.totalRent||0),0);
  const nights = (s,e) => { const d=Math.ceil((new Date(e)-new Date(s))/(1000*60*60*24)); return isNaN(d)?'—':`${d}d`; };

  /* Computed cost preview */
  const selectedMachine = machines.find(m=>m._id===fd.machineId);
  const previewCost = selectedMachine && fd.startDate && fd.endDate
    ? Math.ceil((new Date(fd.endDate)-new Date(fd.startDate))/(1000*60*60*24)) * selectedMachine.rentalPricePerDay
    : null;

  return (
    <div className="mgmt-root">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h1 className="mgmt-title">📋 Rental Agreements</h1>
          <p className="mgmt-subtitle">Create and manage machine rental contracts</p>
        </div>
        <button className={`mgmt-add-btn ${showForm?'mgmt-add-btn-cancel':''}`} onClick={()=>showForm?resetForm():setShowForm(true)}>
          {showForm?'✕ Cancel':'+ New Rental'}
        </button>
      </div>

      {/* ── Premium Form ── */}
      {showForm && (
        <div className="mgmt-drawer" style={{ borderTopColor:'#60a5fa' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
            <div>
              <div className="mgmt-drawer-title" style={{ marginBottom:'0.2rem' }}>Initialize Rental Agreement</div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Select an available machine, customer, and rental period</div>
            </div>
            {previewCost && previewCost > 0 && (
              <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'12px', padding:'0.6rem 1rem', textAlign:'center' }}>
                <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#3b82f6', textTransform:'uppercase', letterSpacing:'0.05em' }}>Estimated Total</div>
                <div style={{ fontSize:'1.25rem', fontWeight:800, color:'#1d4ed8', letterSpacing:'-0.03em' }}>${previewCost.toLocaleString()}</div>
              </div>
            )}
          </div>

          {formAlert && (
            <div className="pf-form-alert pf-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {formAlert}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1 — Asset & Client */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">🏗</div>
                <span className="form-section-title">Asset & Client</span>
              </div>
              <div className="form-grid-2">
                <Field label="Available Machine" required error={touched.machineId&&errors.machineId} valid={isValid('machineId')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}>
                  <div className="pf-select-wrap" style={{ width:'100%' }}>
                    <select className="pf-input" value={fd.machineId} onChange={e=>handleChange('machineId',e.target.value)} onBlur={()=>handleBlur('machineId')}>
                      <option value="">Select available machine…</option>
                      {machines.map(m=><option key={m._id} value={m._id}>{m.name} — ${m.rentalPricePerDay}/day</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Customer" required error={touched.customerId&&errors.customerId} valid={isValid('customerId')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
                  <div className="pf-select-wrap" style={{ width:'100%' }}>
                    <select className="pf-input" value={fd.customerId} onChange={e=>handleChange('customerId',e.target.value)} onBlur={()=>handleBlur('customerId')}>
                      <option value="">Select customer…</option>
                      {customers.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 2 — Period */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">📅</div>
                <span className="form-section-title">Rental Period</span>
                {nights(fd.startDate,fd.endDate)!=='—' && (
                  <span className="form-section-sub" style={{ background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', padding:'0.15rem 0.6rem', borderRadius:'100px', fontWeight:700 }}>
                    {nights(fd.startDate,fd.endDate)} rental
                  </span>
                )}
              </div>
              <div className="form-grid-2">
                <Field label="Start Date" required error={touched.startDate&&errors.startDate} valid={isValid('startDate')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
                  <input className="pf-input" type="date" value={fd.startDate} onChange={e=>handleChange('startDate',e.target.value)} onBlur={()=>handleBlur('startDate')} />
                </Field>
                <Field label="End Date" required error={touched.endDate&&errors.endDate} valid={isValid('endDate')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
                  <input className="pf-input" type="date" value={fd.endDate} onChange={e=>handleChange('endDate',e.target.value)} onBlur={()=>handleBlur('endDate')} />
                </Field>
              </div>
            </div>

            {/* Section 3 — Financial */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">💵</div>
                <span className="form-section-title">Financial Terms</span>
                <span className="form-section-sub">Optional advance</span>
              </div>
              <div style={{ maxWidth:'320px' }}>
                <Field label="Advance Payment ($)" optional error={touched.advancePayment&&errors.advancePayment}
                  helper="Partial payment collected upfront"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}>
                  <input className="pf-input" type="number" min="0" placeholder="0" value={fd.advancePayment}
                    onChange={e=>handleChange('advancePayment',e.target.value)} onBlur={()=>handleBlur('advancePayment')} />
                </Field>
              </div>
            </div>

            <div className="pf-submit-zone">
              <button type="submit" className="pf-submit-btn" disabled={submitting}>
                {submitting?<><span className="pf-spinner" />Finalizing…</>:<>Finalize Agreement →</>}
              </button>
              <button type="button" className="pf-cancel-btn" onClick={resetForm}>Cancel</button>
              {previewCost && <span className="pf-form-note">Est. total: <strong>${previewCost.toLocaleString()}</strong></span>}
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="mgmt-stat-bar">
        {[
          { label:'Total',    val:rentals.length,                                              color:'#96DD99' },
          { label:'Active',   val:rentals.filter(r=>r.status==='Active').length,               color:'#60a5fa' },
          { label:'Completed',val:rentals.filter(r=>r.status==='Completed').length,            color:'#86efac' },
          { label:'Revenue',  val:`$${(totalRevenue/1000).toFixed(1)}k`,                       color:'#4ade80' },
        ].map(s=>(
          <div key={s.label} className="mgmt-stat-chip" style={{'--chip-color':s.color}}>
            <div className="mgmt-stat-chip-val">{s.val}</div>
            <div className="mgmt-stat-chip-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mgmt-toolbar">
        <div className="mgmt-search-wrap">
          <span className="mgmt-search-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input className="mgmt-search" placeholder="Search by machine or customer…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
        </div>
        <select className="mgmt-filter-select" value={filter} onChange={e=>{setFilter(e.target.value);setPage(1);}}>
          {['All','Active','Pending','Completed'].map(s=><option key={s}>{s}</option>)}
        </select>
        <span className="mgmt-count-chip">{filtered.length} rental{filtered.length!==1?'s':''}</span>
      </div>

      {/* Table */}
      <div className="mgmt-table-card">
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead><tr><th>Machine</th><th>Customer</th><th>Period</th><th>Financials</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? [1,2,3].map(i=><tr key={i} className="mgmt-skeleton-row">{[70,60,50,60,40,50].map((w,j)=><td key={j}><div className="mgmt-skeleton" style={{width:`${w}%`}}/></td>)}</tr>)
              : paged.length===0 ? <tr><td colSpan={6}><div className="mgmt-empty"><div className="mgmt-empty-icon">📋</div><div className="mgmt-empty-title">No rentals found</div><div className="mgmt-empty-sub">{search||filter!=='All'?'Try adjusting your search/filter.':'Create your first rental agreement.'}</div>{!search&&filter==='All'&&<button className="mgmt-add-btn" onClick={()=>setShowForm(true)}>+ New Rental</button>}</div></td></tr>
              : paged.map(r=>(
                <tr key={r._id}>
                  <td><div className="mgmt-row-avatar"><div className="mgmt-avatar-icon">🚜</div><div><div className="mgmt-avatar-name">{r.machineId?.name||'—'}</div><div className="mgmt-avatar-sub">{nights(r.startDate,r.endDate)} rental</div></div></div></td>
                  <td><div className="mgmt-avatar-name" style={{fontWeight:600,fontSize:'0.875rem'}}>{r.customerId?.name||'—'}</div></td>
                  <td className="mgmt-cell-muted" style={{fontSize:'0.8rem'}}><div>{new Date(r.startDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div><div style={{color:'#b0c4b1'}}>→ {new Date(r.endDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div></td>
                  <td><div className="mgmt-cell-money">${r.totalRent?.toLocaleString()||0}</div>{r.remainingBalance>0&&<div style={{fontSize:'0.72rem',color:'#c2410c',fontWeight:600}}>Due: ${r.remainingBalance?.toLocaleString()}</div>}</td>
                  <td><span className={`mgmt-badge mgmt-badge-${r.status?.toLowerCase()}`}>{r.status}</span></td>
                  <td><div className="mgmt-actions">{r.status!=='Completed'&&<button className="mgmt-action-btn mgmt-btn-complete" onClick={()=>completeRental(r._id)}>✓ Complete</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages>1&&(
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

export default Rentals;
