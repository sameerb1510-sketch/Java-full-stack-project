import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate } from '../api.js'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

export default function CheckIn() {
  const [memberCode, setMemberCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault(); setError(''); setMessage(''); setResult(null)
    if (!/^\d{4}$/.test(memberCode)) { setError('Enter the 4-digit code printed on the member record.'); return }
    setSaving(true)
    try {
      const data = await api('/attendance', { method: 'POST', body: JSON.stringify({ memberCode }) })
      setResult(data); setMessage(`${data.memberName} is checked in for today.`); setMemberCode('')
    } catch (problem) { setError(problem.message) }
    finally { setSaving(false) }
  }

  return (
    <>
      <PageHeading eyebrow="FRONT DESK" title="Member check-in" description="A quick welcome starts with a quick check-in." />
      <div className="checkin-layout">
        <section className="checkin-card">
          <div className="checkin-orb"><span>↳</span></div>
          <span className="eyebrow">TODAY’S VISITS</span>
          <h2>Check in a member</h2>
          <Notice>{error}</Notice><Notice tone="success">{message}</Notice>
          <form onSubmit={submit} className="checkin-form">
            <label className="field"><span>Member code</span><input className="code-input" autoFocus inputMode="numeric" maxLength="4" placeholder="0000" value={memberCode} onChange={(event) => setMemberCode(event.target.value.replace(/\D/g, ''))} aria-label="4-digit member code" /></label>
            <button className="button button-primary checkin-submit" disabled={saving}>{saving ? 'Checking…' : 'Check in member'} <span>→</span></button>
          </form>
          {result && <div className="checkin-result"><div className="result-check">✓</div><div><strong>{result.memberName}</strong><span>Code {result.memberCode} · {formatDate(result.checkInDate)}</span></div><Link to={`/attendance/${result.memberId}`}>History →</Link></div>}
        </section>
      </div>
    </>
  )
}
