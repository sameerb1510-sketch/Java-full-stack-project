import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Members from './pages/Members.jsx'
import MemberForm from './pages/MemberForm.jsx'
import ExpiredMembers from './pages/ExpiredMembers.jsx'
import Plans from './pages/Plans.jsx'
import CheckIn from './pages/CheckIn.jsx'
import Attendance from './pages/Attendance.jsx'
import Payments from './pages/Payments.jsx'
import Login from './pages/Login.jsx'

const navigation = [
  { label: 'Dashboard', to: '/', icon: '◫', end: true },
  { label: 'Members', to: '/members', icon: '♙' },
  { label: 'Expired', to: '/expired', icon: '◷' },
  { label: 'Plans', to: '/plans', icon: '▤' },
  { label: 'Check in', to: '/checkin', icon: '↳' },
]

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = navigation.find((item) => item.to === location.pathname)?.label
    ?? (location.pathname.startsWith('/members/') ? 'Members' : 'Dashboard')

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">F</div>
          <div><strong>FORGE</strong><span>FITNESS CLUB</span></div>
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="club-status"><span className="status-dot" /> Club open <span>06:00–22:00</span></div>
          <div className="profile-card"><div className="profile-avatar">S</div><div><strong>Sameer</strong><span>Club admin</span></div><button className="profile-menu logout-button" title="Sign out" aria-label="Sign out" onClick={() => { localStorage.removeItem('forgeLoggedIn'); navigate('/login', { replace: true }) }}>↪</button></div>
        </div>
      </aside>
      <main className="main-area">
        {import.meta.env.VITE_DEMO_MODE === 'true' && <div className="demo-banner">Public UI demo · sample data · changes aren’t saved</div>}
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-separator">/</span><strong>{activePage}</strong></div>
          <div className="topbar-right"><span className="today-label">{new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}</span><div className="topbar-avatar">S</div></div>
        </header>
        <div className="page-container"><Outlet /></div>
      </main>
    </div>
  )
}

function RequireLogin() {
  return localStorage.getItem('forgeLoggedIn') === 'true' ? <AppShell /> : <Navigate to="/login" replace />
}

function NotFound() {
  return <section className="empty-state"><span className="empty-icon">?</span><h2>Page not found</h2><p>That page doesn’t exist. Head back to your dashboard.</p><NavLink className="button button-primary" to="/">Go to dashboard</NavLink></section>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireLogin />}>
        <Route index element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="members/add" element={<MemberForm />} />
        <Route path="members/edit/:id" element={<MemberForm />} />
        <Route path="expired" element={<ExpiredMembers />} />
        <Route path="plans" element={<Plans />} />
        <Route path="checkin" element={<CheckIn />} />
        <Route path="attendance/:memberId" element={<Attendance />} />
        <Route path="payments/:memberId" element={<Payments />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
