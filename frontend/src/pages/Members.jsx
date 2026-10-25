import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate, memberStatus } from '../api.js'
import LoadingState from '../components/LoadingState.jsx'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

export default function Members() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadMembers = useCallback(async (query = '') => {
    setError('')
    try {
      const path = query.trim() ? `/members/search?name=${encodeURIComponent(query.trim())}` : '/members'
      setMembers(await api(path))
    } catch (problem) { setError(problem.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => loadMembers(search), 220)
    return () => clearTimeout(timer)
  }, [search, loadMembers])

  async function removeMember(member) {
    if (!window.confirm(`Delete ${member.name} and their attendance/payment history?`)) return
    try { await api(`/members/${member.id}`, { method: 'DELETE' }); await loadMembers(search) }
    catch (problem) { setError(problem.message) }
  }

  return (
    <>
      <PageHeading eyebrow="PEOPLE" title="Members" description="Manage memberships, contact details, and activity." action={<Link className="button button-primary" to="/members/add"><span>＋</span> Add member</Link>} />
      <Notice>{error}</Notice>
      <section className="panel member-panel">
        <div className="toolbar"><div className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by member name…" aria-label="Search members by name" /></div><span className="result-count">{members.length} {members.length === 1 ? 'member' : 'members'}</span></div>
        {loading ? <LoadingState /> : members.length === 0 ? <div className="empty-state compact"><span className="empty-icon">♙</span><h2>{search ? 'No members found' : 'No members yet'}</h2><p>{search ? 'Try a different name.' : 'Add your first member to get started.'}</p>{!search && <Link className="button button-primary" to="/members/add">Add member</Link>}</div> : (
          <div className="table-wrap"><table><thead><tr><th>MEMBER</th><th>PLAN</th><th>EXPIRES</th><th>MEMBER CODE</th><th>STATUS</th><th className="align-right">ACTIONS</th></tr></thead><tbody>
            {members.map((member) => {
              const status = memberStatus(member.expiryDate)
              return <tr key={member.id} className={status === 'Expired' ? 'row-expired' : ''}>
                <td><div className="member-cell"><div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div><div><strong>{member.name}</strong><span>{member.phone}</span></div></div></td>
                <td><span className="plan-name">{member.planName}</span></td><td>{formatDate(member.expiryDate)}</td>
                <td><span className="code-chip">{member.memberCode}</span></td>
                <td><span className={`status-pill ${status.toLowerCase().replace(' ', '-')}`}>{status}</span></td>
                <td><div className="row-actions">
                  <Link className="row-action-link" title="View attendance" aria-label={`View attendance for ${member.name}`} to={`/attendance/${member.id}`}><span aria-hidden="true">↳</span> Attendance</Link>
                  <Link className="row-action-link" title="View payments" aria-label={`View payments for ${member.name}`} to={`/payments/${member.id}`}><span aria-hidden="true">₹</span> Payments</Link>
                  <Link className="row-action-link" title="Edit member" aria-label={`Edit ${member.name}`} to={`/members/edit/${member.id}`}>Edit</Link>
                  <button title="Delete member" className="row-action-link row-action-delete" onClick={() => removeMember(member)} aria-label={`Delete ${member.name}`}><span aria-hidden="true">×</span> Delete</button>
                </div></td>
              </tr>
            })}
          </tbody></table></div>
        )}
      </section>
      <div className="helper-note"><span>i</span> Every new member receives a unique 4-digit check-in code.</div>
    </>
  )
}
