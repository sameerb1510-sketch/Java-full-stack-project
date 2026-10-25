import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate, formatMoney, memberStatus } from '../api.js'
import gymBanner from '../assets/gym-banner.jpg'
import LoadingState from '../components/LoadingState.jsx'
import Notice from '../components/Notice.jsx'
import PageHeading from '../components/PageHeading.jsx'

function MetricCard({ label, value, detail, icon, tone }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}</div><strong>{value}</strong><span>{detail}</span></article>
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [members, setMembers] = useState([])
  const [expiring, setExpiring] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api('/dashboard'), api('/members'), api('/members/expired')])
      .then(([stats, allMembers, dueMembers]) => {
        setSummary(stats); setMembers(allMembers); setExpiring(dueMembers)
      })
      .catch((problem) => setError(problem.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState label="Getting the club ready…" />
  const recentMembers = [...members].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <>
      <PageHeading action={<Link className="button button-primary" to="/members/add"><span>＋</span> Add member</Link>} />
      <section className="gym-banner" aria-label="Forge Fitness Club">
        <div className="gym-banner-copy"><span>FORGE FITNESS CLUB</span><strong>Every rep counts.</strong><small>A club built on consistency.</small></div>
        <img src={gymBanner} alt="A member choosing a dumbbell from the gym rack" />
      </section>
      <Notice>{error}</Notice>
      <section className="metric-grid">
        <MetricCard label="Total members" value={summary?.totalMembers ?? '—'} detail="Across all membership plans" icon="♙" tone="metric-purple" />
        <MetricCard label="Active memberships" value={summary?.activeMembers ?? '—'} detail="Membership valid today" icon="✓" tone="metric-green" />
        <MetricCard label="Expiring soon" value={summary?.expiringSoon ?? '—'} detail="Due in the next 7 days" icon="◷" tone="metric-amber" />
        <MetricCard label="Expired" value={summary?.expiredMembers ?? '—'} detail="Needs renewal" icon="↗" tone="metric-red" />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading"><div><h2>Recent members</h2><p>Your latest additions to the club</p></div><Link className="text-link" to="/members">View all <span>→</span></Link></div>
          {recentMembers.length === 0 ? <div className="panel-empty">Your member list is ready for its first addition.</div> : (
            <div className="table-wrap"><table><thead><tr><th>MEMBER</th><th>PLAN</th><th>EXPIRES</th><th>STATUS</th></tr></thead><tbody>
              {recentMembers.map((member) => <tr key={member.id}><td><div className="member-cell"><div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div><div><strong>{member.name}</strong><span>{member.memberCode} · {member.phone}</span></div></div></td><td>{member.planName}</td><td>{formatDate(member.expiryDate)}</td><td><span className={`status-pill ${memberStatus(member.expiryDate).toLowerCase().replace(' ', '-')}`}>{memberStatus(member.expiryDate)}</span></td></tr>)}
            </tbody></table></div>
          )}
        </article>
        <article className="panel attention-panel">
          <div className="panel-heading"><div><h2>Membership watch</h2><p>Expired or ending within 7 days</p></div><span className="attention-count">{expiring.length}</span></div>
          {expiring.length === 0 ? <div className="panel-empty">All memberships are in good shape.</div> : <div className="attention-list">
            {expiring.slice(0, 5).map((member) => <div className="attention-row" key={member.id}><div className="member-avatar avatar-small">{member.name.charAt(0).toUpperCase()}</div><div className="attention-name"><strong>{member.name}</strong><span>{member.planName}</span></div><span className="attention-date">{formatDate(member.expiryDate)}</span></div>)}
            <Link className="attention-link" to="/expired">Review memberships <span>→</span></Link>
          </div>}
        </article>
      </section>

      <section className="quick-actions"><div><span className="eyebrow">QUICK ACTIONS</span><h2>Keep your club moving</h2></div><div className="quick-action-list"><Link to="/checkin" className="quick-action"><span className="quick-icon quick-lime">↳</span><span><strong>Check in a member</strong><small>Use a 4-digit member code</small></span><b>→</b></Link><Link to="/plans" className="quick-action"><span className="quick-icon quick-lilac">▤</span><span><strong>Manage plans</strong><small>Update duration and pricing</small></span><b>→</b></Link></div></section>
    </>
  )
}
