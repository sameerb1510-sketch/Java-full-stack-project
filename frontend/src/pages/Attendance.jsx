import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDate } from '../api.js'
import LoadingState from '../components/LoadingState.jsx'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

export default function Attendance() {
  const { memberId } = useParams()
  const [history, setHistory] = useState([])
  const [member, setMember] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api(`/attendance/${memberId}`), api(`/members/${memberId}`)])
      .then(([records, memberData]) => { setHistory(records); setMember(memberData) })
      .catch((problem) => setError(problem.message)).finally(() => setLoading(false))
  }, [memberId])

  if (loading) return <LoadingState label="Loading attendance history…" />
  return <>
    <PageHeading eyebrow="MEMBER ACTIVITY" title="Attendance history" description={member ? `${member.name} · Member code ${member.memberCode}` : 'Check-in dates for this member.'} action={<Link className="button button-secondary" to="/members">← Members</Link>} />
    <Notice>{error}</Notice>
    <section className="panel member-panel">
      <div className="toolbar"><div><strong className="toolbar-title">Visits</strong><span className="toolbar-subtitle">Check-ins recorded for {member?.name || 'this member'}</span></div><span className="attention-count">{history.length}</span></div>
      {history.length === 0 ? <div className="empty-state compact"><span className="empty-icon">↳</span><h2>No visits recorded yet</h2><p>The member’s first check-in will appear here.</p></div> : <div className="table-wrap"><table><thead><tr><th>DATE</th><th>MEMBER</th><th>CODE</th><th>STATUS</th></tr></thead><tbody>{history.map((record) => <tr key={record.id}><td>{formatDate(record.checkInDate)}</td><td>{record.memberName}</td><td><span className="code-chip">{record.memberCode}</span></td><td><span className="status-pill active">Checked in</span></td></tr>)}</tbody></table></div>}
    </section>
  </>
}
