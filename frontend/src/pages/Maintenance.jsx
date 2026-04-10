import { useState, useEffect, useMemo } from 'react';
import Service from '../api/services';
import '../mgmt.css';

const PAGE_SIZE = 8;
const MAX_ISSUE_CHARS = 400;

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

const Maintenance = () => {
  const [records, setRecords]   = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [fd, setFd]             = useState({ machineId:'', issue:'', cost:'', date:'' });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [formAlert, setFormAlert] = useState(null);
  const user    = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, m] = await Promise.all([
        Service.maintenance.get(),
        Service.machines.get()
      ]);
      setRecords(r.data);
      setMachines(m.data);
    } catch(e) {
      console.error(e);
      setFormAlert('Failed to load maintenance logs.');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const validate = (d) => {
    const e = {};
    if (!d.machineId)    e.machineId = 'Please select a machine';
    if (!d.date)         e.date      = 'Service date is required';
    if (!d.cost)         e.cost      = 'Repair cost is required';
    else if (Number(d.cost) < 0) e.cost = 'Cost cannot be negative';
    if (!d.issue.trim()) e.issue     = 'Issue description is required';
    else if (d.issue.length < 10) e.issue = 'Describe the issue in at least 10 characters';
    else if (d.issue.length > MAX_ISSUE_CHARS) e.issue = `Maximum ${MAX_ISSUE_CHARS} characters allowed`;
    return e;
  };

  const handleBlur  = (f)    => { setTouched(t=>({...t,[f]:true})); setErrors(validate(fd)); };
  const handleChange = (f,v) => { const n={...fd,[f]:v}; setFd(n); if(touched[f]) setErrors(validate(n)); };
  const isValid      = (f)   => touched[f]&&!errors[f]&&fd[f];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const all={machineId:true,date:true,cost:true,issue:true};
    setTouched(all);
    const errs=validate(fd); setErrors(errs);
    if(Object.keys(errs).length>0) return;
    setSubmitting(true); setFormAlert(null);
    try {
      await Service.maintenance.create(fd);
      setShowForm(false); setFd({machineId:'',issue:'',cost:'',date:''});
      setErrors({}); setTouched({}); fetchData();
    } catch(err) { setFormAlert(err.response?.data?.message||'Failed to save service record.'); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => { setShowForm(false); setFd({machineId:'',issue:'',cost:'',date:''}); setErrors({}); setTouched({}); setFormAlert(null); };

  const filtered = useMemo(() => {
    if(!search) return records;
    const q=search.toLowerCase();
    return records.filter(r=>r.machineId?.name?.toLowerCase().includes(q)||r.issue?.toLowerCase().includes(q));
  }, [records, search]);

  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalCost = records.reduce((s,r)=>s+(Number(r.cost)||0),0);
  const thisMonth = records.filter(r=>{ const d=new Date(r.date),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length;

  const issueChars = fd.issue.length;
  const issueWarn  = issueChars > MAX_ISSUE_CHARS * 0.8;
  const issueOver  = issueChars > MAX_ISSUE_CHARS;

  return (
    <div className="mgmt-root">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h1 className="mgmt-title">🔧 Maintenance Logs</h1>
          <p className="mgmt-subtitle">Track service records and repair costs per machine</p>
        </div>
        {isAdmin && (
          <button className={`mgmt-add-btn ${showForm?'mgmt-add-btn-cancel':''}`} onClick={()=>showForm?resetForm():setShowForm(true)}>
            {showForm?'✕ Cancel':'+ Log Issue'}
          </button>
        )}
      </div>

      {/* ── Premium Form ── */}
      {showForm && (
        <div className="mgmt-drawer" style={{ borderTopColor:'#fb923c' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
            <div>
              <div className="mgmt-drawer-title" style={{ marginBottom:'0.2rem' }}>Log Service Record</div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Document the issue, service date, and repair costs for your records</div>
            </div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', padding:'0.3rem 0.7rem', background:'#fff7ed', borderRadius:'100px', border:'1px solid #fed7aa', color:'#c2410c', fontWeight:700 }}>
              🔧 Service Record
            </div>
          </div>

          {formAlert && (
            <div className="pf-form-alert pf-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {formAlert}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1 — Machine & Schedule */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon" style={{ background:'#fff7ed', border:'1px solid #fed7aa' }}>🚜</div>
                <span className="form-section-title">Machine & Schedule</span>
              </div>
              <div className="form-grid-3">
                <Field label="Machine" required error={touched.machineId&&errors.machineId} valid={isValid('machineId')}
                  className="form-col-span-2"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}>
                  <div className="pf-select-wrap" style={{ width:'100%' }}>
                    <select className="pf-input" value={fd.machineId} onChange={e=>handleChange('machineId',e.target.value)} onBlur={()=>handleBlur('machineId')}>
                      <option value="">Select machine to log…</option>
                      {machines.map(m=><option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Service Date" required error={touched.date&&errors.date} valid={isValid('date')}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
                  <input className="pf-input" type="date" value={fd.date} onChange={e=>handleChange('date',e.target.value)} onBlur={()=>handleBlur('date')} />
                </Field>
              </div>
            </div>

            {/* Section 2 — Cost */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon" style={{ background:'#fff7ed', border:'1px solid #fed7aa' }}>💸</div>
                <span className="form-section-title">Repair Cost</span>
              </div>
              <div style={{ maxWidth:'280px' }}>
                <Field label="Total Cost ($)" required error={touched.cost&&errors.cost} valid={isValid('cost')}
                  helper="Total parts + labour cost"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}>
                  <input className="pf-input" type="number" min="0" placeholder="0.00" value={fd.cost}
                    onChange={e=>handleChange('cost',e.target.value)} onBlur={()=>handleBlur('cost')} />
                </Field>
              </div>
            </div>

            {/* Section 3 — Issue Description */}
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon" style={{ background:'#fff7ed', border:'1px solid #fed7aa' }}>📝</div>
                <span className="form-section-title">Issue Description</span>
                <span className={`pf-char-count ${issueWarn?'pf-char-warn':''} ${issueOver?'pf-char-over':''}`} style={{ marginLeft:'auto' }}>
                  {issueChars}/{MAX_ISSUE_CHARS}
                </span>
              </div>
              <div className={`pf ${touched.issue&&errors.issue?'pf-error':isValid('issue')?'pf-valid':''}`}>
                <div className="pf-wrap">
                  <textarea
                    className="pf-input pf-textarea"
                    placeholder="Describe the fault, parts replaced, and actions taken. Be specific for future reference (min 10 characters)…"
                    value={fd.issue}
                    onChange={e=>handleChange('issue',e.target.value)}
                    onBlur={()=>handleBlur('issue')}
                    maxLength={MAX_ISSUE_CHARS + 10}
                    style={{ minHeight:'110px' }}
                  />
                </div>
                {touched.issue&&errors.issue&&<div className="pf-error-msg">⚠ {errors.issue}</div>}
                {!errors.issue&&fd.issue&&<div className="pf-helper">Detailed notes help with future diagnostics and warranty claims.</div>}
              </div>
            </div>

            <div className="pf-submit-zone">
              <button type="submit" className="pf-submit-btn pf-btn-orange" disabled={submitting}>
                {submitting?<><span className="pf-spinner" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />Saving…</>:<>Save Record →</>}
              </button>
              <button type="button" className="pf-cancel-btn" onClick={resetForm}>Cancel</button>
              <span className="pf-form-note">Records are stored permanently</span>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="mgmt-stat-bar">
        {[
          { label:'Total Logs',  val:records.length,                    color:'#96DD99' },
          { label:'Total Cost',  val:`$${totalCost.toLocaleString()}`, color:'#fca5a5' },
          { label:'This Month',  val:thisMonth,                         color:'#fcd34d' },
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
          <input className="mgmt-search" placeholder="Search by machine or issue description…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
        </div>
        <span className="mgmt-count-chip">{filtered.length} record{filtered.length!==1?'s':''}</span>
      </div>

      {/* Table */}
      <div className="mgmt-table-card">
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead><tr><th>Machine</th><th>Date</th><th>Issue</th><th>Cost</th></tr></thead>
            <tbody>
              {loading ? [1,2,3].map(i=><tr key={i} className="mgmt-skeleton-row">{[60,40,80,30].map((w,j)=><td key={j}><div className="mgmt-skeleton" style={{width:`${w}%`}}/></td>)}</tr>)
              : paged.length===0 ? <tr><td colSpan={4}><div className="mgmt-empty"><div className="mgmt-empty-icon">🔧</div><div className="mgmt-empty-title">No maintenance records</div><div className="mgmt-empty-sub">{search?'Try a different search term.':'Log your first service record.'}</div>{isAdmin&&!search&&<button className="mgmt-add-btn" onClick={()=>setShowForm(true)}>+ Log Issue</button>}</div></td></tr>
              : paged.map(r=>(
                <tr key={r._id}>
                  <td><div className="mgmt-row-avatar"><div className="mgmt-avatar-icon" style={{background:'#fff7ed',border:'1px solid #fed7aa'}}>🔧</div><div><div className="mgmt-avatar-name">{r.machineId?.name||'—'}</div><div className="mgmt-avatar-sub">#{r._id?.slice(-6).toUpperCase()}</div></div></div></td>
                  <td><div style={{fontWeight:600,fontSize:'0.875rem'}}>{new Date(r.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div></td>
                  <td><div style={{maxWidth:'320px',fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.45}}>{r.issue}</div></td>
                  <td><span style={{fontWeight:800,color:'#c2410c',fontSize:'0.95rem'}}>${Number(r.cost).toLocaleString()}</span></td>
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

export default Maintenance;
