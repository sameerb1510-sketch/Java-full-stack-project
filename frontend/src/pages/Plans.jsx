import { useEffect, useState } from 'react'
import { api, formatMoney } from '../api.js'
import LoadingState from '../components/LoadingState.jsx'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

const blankPlan = { name: '', durationMonths: '1', price: '' }

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(blankPlan)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function loadPlans() {
    try { setPlans(await api('/plans')); setError('') }
    catch (problem) { setError(problem.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadPlans() }, [])

  function beginCreate() {
    setEditingId(null); setForm(blankPlan); setError(''); setSuccess(''); setShowForm(true)
  }

  function beginEdit(plan) {
    setEditingId(plan.id); setForm({ name: plan.name, durationMonths: String(plan.durationMonths), price: String(plan.price) }); setError(''); setSuccess(''); setShowForm(true)
  }

  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess(''); setSaving(true)
    try {
      const body = { name: form.name.trim(), durationMonths: Number(form.durationMonths), price: Number(form.price) }
      await api(editingId ? `/plans/${editingId}` : '/plans', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(body) })
      setSuccess(editingId ? 'Plan updated.' : 'Plan added.')
      setShowForm(false); setForm(blankPlan); setEditingId(null); await loadPlans()
    } catch (problem) { setError(problem.message) }
    finally { setSaving(false) }
  }

  async function removePlan(plan) {
    if (!window.confirm(`Delete the ${plan.name} plan?`)) return
    setError(''); setSuccess('')
    try { await api(`/plans/${plan.id}`, { method: 'DELETE' }); setSuccess('Plan deleted.'); await loadPlans() }
    catch (problem) { setError(problem.message) }
  }

  return (
    <>
      <PageHeading eyebrow="MEMBERSHIP SETUP" title="Plans & pricing" action={<button className="button button-primary" onClick={beginCreate}><span>＋</span> Add plan</button>} />
      <Notice>{error}</Notice><Notice tone="success">{success}</Notice>
      {loading ? <LoadingState /> : <section className="plan-grid">
        {plans.map((plan, index) => <article className={`plan-card ${index === 1 ? 'plan-featured' : ''}`} key={plan.id}>
          <div className="plan-card-top"><div className={`plan-symbol plan-symbol-${index % 3}`}>{index === 0 ? '01' : index === 1 ? '03' : '12'}</div><div className="plan-actions"><button className="icon-button" onClick={() => beginEdit(plan)} aria-label={`Edit ${plan.name}`}>✎</button><button className="icon-button danger-icon" onClick={() => removePlan(plan)} aria-label={`Delete ${plan.name}`}>×</button></div></div>
          <div className="eyebrow">MEMBERSHIP PLAN</div><h2>{plan.name}</h2><p className="plan-duration">{plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'} of training</p>
          <div className="plan-price">{formatMoney(plan.price)}<span> / plan</span></div>
          <div className="plan-card-footer"><span><i className="status-dot" /> Membership access</span><span>Renews on payment</span></div>
        </article>)}
        {plans.length === 0 && <div className="empty-state compact panel"><span className="empty-icon">▤</span><h2>No plans yet</h2><p>Add a plan before enrolling members.</p><button className="button button-primary" onClick={beginCreate}>Create first plan</button></div>}
      </section>}

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false) }}>
        <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="plan-form-title">
          <div className="modal-heading"><div><span className="eyebrow">PLAN DETAILS</span><h2 id="plan-form-title">{editingId ? 'Edit plan' : 'Add a plan'}</h2></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close">×</button></div>
          <Notice>{error}</Notice>
          <form onSubmit={submit}>
            <label className="field"><span>Plan name <b>*</b></span><input autoFocus required maxLength="40" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Monthly" /></label>
            <div className="field-grid modal-fields"><label className="field"><span>Duration in months <b>*</b></span><input type="number" min="1" required value={form.durationMonths} onChange={(event) => setForm({ ...form, durationMonths: event.target.value })} /></label><label className="field"><span>Price (₹) <b>*</b></span><input type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="999" /></label></div>
            <div className="form-actions"><button type="button" className="button button-secondary" onClick={() => setShowForm(false)}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add plan'}</button></div>
          </form>
        </section>
      </div>}
    </>
  )
}
