import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'
import LoadingState from '../components/LoadingState.jsx'

const today = new Date().toISOString().slice(0, 10)

export default function MemberForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', joinDate: today, planId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const requests = [api('/plans')]
    if (editing) requests.push(api(`/members/${id}`))
    Promise.all(requests).then(([planData, member]) => {
      setPlans(planData)
      if (member) setForm({ name: member.name, phone: member.phone, email: member.email, joinDate: member.joinDate, planId: String(member.planId) })
    }).catch((problem) => setError(problem.message)).finally(() => setLoading(false))
  }, [editing, id])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault(); setError('')
    if (!/^\d{10}$/.test(form.phone)) { setError('Phone must be exactly 10 digits.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return }
    setSaving(true)
    try {
      await api(editing ? `/members/${id}` : '/members', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify({ ...form, planId: Number(form.planId) }),
      })
      navigate('/members')
    } catch (problem) { setError(problem.message) }
    finally { setSaving(false) }
  }

  if (loading) return <LoadingState label="Loading member form…" />

  return (
    <>
      <PageHeading eyebrow="MEMBER RECORD" title={editing ? 'Edit member' : 'Add a member'} description={editing ? 'Update their details and membership plan.' : 'Create a new membership for your club.'} />
      <div className="form-layout">
        <form className="panel form-panel" onSubmit={submit}>
          <div className="form-section-heading"><span className="section-number">01</span><div><h2>Personal details</h2><p>Contact details are used to identify the member.</p></div></div>
          <Notice>{error}</Notice>
          <div className="field-grid">
            <label className="field"><span>Full name <b>*</b></span><input name="name" value={form.name} onChange={updateField} required maxLength="100" placeholder="e.g. Aanya Sharma" autoFocus /></label>
            <label className="field"><span>Phone number <b>*</b></span><input name="phone" inputMode="numeric" value={form.phone} onChange={updateField} required pattern="\d{10}" maxLength="10" placeholder="10-digit mobile number" /></label>
            <label className="field"><span>Email address <b>*</b></span><input name="email" type="email" value={form.email} onChange={updateField} required maxLength="160" placeholder="member@example.com" /></label>
            <label className="field"><span>Joining date <b>*</b></span><input name="joinDate" type="date" value={form.joinDate} onChange={updateField} required max={today} /></label>
          </div>
          <div className="form-section-heading spaced-heading"><span className="section-number">02</span><div><h2>Membership plan</h2><p>The plan sets the membership expiry date.</p></div></div>
          <label className="field"><span>Choose a plan <b>*</b></span><select name="planId" value={form.planId} onChange={updateField} required><option value="">Select membership plan</option>{plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}</option>)}</select></label>
          {plans.length === 0 && <div className="inline-hint">Add a plan before creating a member record. <Link to="/plans">Manage plans</Link></div>}
          <div className="form-actions"><Link className="button button-secondary" to="/members">Cancel</Link><button className="button button-primary" type="submit" disabled={saving || plans.length === 0}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create member'}</button></div>
        </form>
        <aside className="form-aside"><div className="aside-art"><span>F</span><i>+</i></div><div className="eyebrow">MEMBER CODE</div><h3>A code is created automatically</h3><p>Each member receives a unique 4-digit code for quick check-in at the front desk.</p></aside>
      </div>
    </>
  )
}
