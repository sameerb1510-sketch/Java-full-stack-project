import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate, memberStatus } from '../api.js'
import LoadingState from '../components/LoadingState.jsx'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

export default function ExpiredMembers() {
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/members/expired').then(setMembers).catch((problem) => setError(problem.message)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeading eyebrow="MEMBERSHIPS" title="Renewal watch" description="Expired memberships and those ending within the next 7 days." />
      <Notice>{error}</Notice>
      <section className="panel member-panel">
        <div className="toolbar"><div><strong className="toolbar-title">Needs attention</strong><span className="toolbar-subtitle">Reach out and keep members active</span></div><span className="attention-count">{members.length}</span></div>
        {loading ? <LoadingState /> : members.length === 0 ? <div className="empty-state compact"><span className="empty-icon success-empty">✓</span><h2>All memberships are current</h2><p>No members have expired or are expiring this week.</p></div> : (
          <div className="table-wrap"><table><thead><tr><th>MEMBER</th><th>PLAN</th><th>EXPIRED / DUE</th><th>MEMBER CODE</th><th>STATUS</th><th></th></tr></thead><tbody>
            {members.map((member) => { const status = memberStatus(member.expiryDate); return <tr key={member.id} className={status === 'Expired' ? 'row-expired' : ''}><td><div className="member-cell"><div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div><div><strong>{member.name}</strong><span>{member.phone}</span></div></div></td><td>{member.planName}</td><td>{formatDate(member.expiryDate)}</td><td><span className="code-chip">{member.memberCode}</span></td><td><span className={`status-pill ${status.toLowerCase().replace(' ', '-')}`}>{status}</span></td><td><Link className="text-link" to={`/payments/${member.id}`}>Record payment →</Link></td></tr> })}
          </tbody></table></div>
        )}
      </section>
    </>
  )
}
