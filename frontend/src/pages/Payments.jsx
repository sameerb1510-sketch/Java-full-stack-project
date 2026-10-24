import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDate, formatMoney } from '../api.js'
import LoadingState from '../components/LoadingState.jsx'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

export default function Payments() {
  const { memberId } = useParams()
  const [member, setMember] = useState(null)
  const [payments, setPayments] = useState([])
  const [plans, setPlans] = useState([])
  const [planId, setPlanId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const [memberData, paymentData, planData] = await Promise.all([
      api(`/members/${memberId}`), api(`/payments/${memberId}`), api('/plans'),
    ])
    setMember(memberData); setPayments(paymentData); setPlans(planData)
    return memberData
  }, [memberId])

  useEffect(() => {
    load().then((memberData) => {
      setPlanId(String(memberData.planId))
    }).catch((problem) => setError(problem.message)).finally(() => setLoading(false))
  }, [load])

  function choosePlan(plan) {
    setPlanId(String(plan.id))
  }

  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess('')
    const selectedPlan = plans.find((plan) => String(plan.id) === planId)
    if (!selectedPlan) { setError('Choose a valid renewal plan.'); return }
    setSaving(true)
    try {
      await api('/payments', { method: 'POST', body: JSON.stringify({ memberId: Number(memberId), planId: Number(planId) }) })
      const refreshedMember = await load(); setSuccess(`Payment recorded. ${refreshedMember.planName} membership renewed through ${formatDate(refreshedMember.expiryDate)}.`)
    } catch (problem) { setError(problem.message) }
    finally { setSaving(false) }
  }

  if (loading) return <LoadingState label="Loading payment history…" />
  return <>
    <PageHeading eyebrow="MEMBER ACCOUNT" title="Payments & renewals" description={member ? `${member.name} · ${member.planName} plan` : 'Membership payment history.'} action={<Link className="button button-secondary" to="/members">← Members</Link>} />
    <Notice>{error}</Notice><Notice tone="success">{success}</Notice>
    <div className="payment-layout">
      <section className="panel member-panel">
        <div className="toolbar"><div><strong className="toolbar-title">Payment history</strong><span className="toolbar-subtitle">Recorded renewals for {member?.name}</span></div><span className="attention-count">{payments.length}</span></div>
        {payments.length === 0 ? <div className="empty-state compact"><span className="empty-icon">₹</span><h2>No payments recorded yet</h2><p>Payments will extend this member’s plan.</p></div> : <div className="table-wrap"><table><thead><tr><th>DATE</th><th>PLAN</th><th>AMOUNT</th><th>RENEWAL</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{formatDate(payment.paymentDate)}</td><td>{payment.planName}</td><td><strong>{formatMoney(payment.amount)}</strong></td><td>{payment.planDurationMonths} {payment.planDurationMonths === 1 ? 'month' : 'months'}</td></tr>)}</tbody></table></div>}
      </section>
      <aside className="panel payment-form-panel"><span className="eyebrow">MEMBERSHIP RENEWAL</span><h2>Choose a plan</h2><p>Select one of the club’s three plans for this renewal.</p><div className="renewal-preview"><span>Current membership ends</span><strong>{formatDate(member?.expiryDate)}</strong><small>{member?.planName}</small></div><form onSubmit={submit}>
        <div className="renewal-plan-options" role="radiogroup" aria-label="Renewal plan">
          {plans.map((plan) => <label className={`renewal-plan-option${planId === String(plan.id) ? ' selected' : ''}`} key={plan.id}><input type="radio" name="renewalPlan" value={plan.id} checked={planId === String(plan.id)} onChange={() => choosePlan(plan)} /><span className="renewal-plan-copy"><strong>{plan.name}</strong><small>{plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}</small></span><span className="renewal-plan-price">{formatMoney(plan.price)}</span></label>)}
        </div>
        <div className="renewal-preview"><span>Payment due</span><strong>{formatMoney(plans.find((plan) => String(plan.id) === planId)?.price ?? 0)}</strong></div><button className="button button-primary full-width" disabled={saving || !planId || plans.length === 0}>{saving ? 'Recording…' : 'Record renewal payment'}</button></form></aside>
    </div>
  </>
}
