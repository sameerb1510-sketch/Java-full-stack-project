import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const username = import.meta.env.VITE_LOGIN_USERNAME || 'Admin'
const password = import.meta.env.VITE_LOGIN_PASSWORD || 'forge123'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  if (localStorage.getItem('forgeLoggedIn') === 'true') return <Navigate to="/" replace />

  function submit(event) {
    event.preventDefault()
    if (user.trim() !== username || pass !== password) {
      setError('Username or password is incorrect.')
      return
    }
    localStorage.setItem('forgeLoggedIn', 'true')
    navigate('/', { replace: true })
  }

  return <main className="login-page"><section className="login-card">
    <div className="brand-lockup"><div className="brand-mark">F</div><div><strong>FORGE</strong><span>FITNESS CLUB</span></div></div>
    <span className="eyebrow">STAFF ACCESS</span><h1>Welcome back</h1><p>Sign in to manage your club.</p>
    {import.meta.env.VITE_DEMO_MODE === 'true' && <div className="demo-login-hint">Demo login: <strong>Admin</strong> / <strong>forge123</strong></div>}
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    <form onSubmit={submit}>
      <label className="field"><span>Username</span><input autoComplete="username" required value={user} onChange={(event) => setUser(event.target.value)} /></label>
      <label className="field"><span>Password</span><input type="password" autoComplete="current-password" required value={pass} onChange={(event) => setPass(event.target.value)} /></label>
      <button className="button button-primary full-width">Sign in</button>
    </form>
  </section></main>
}
