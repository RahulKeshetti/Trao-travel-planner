import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DEMO_ACCOUNTS } from '../services/mockData.js'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function fillDemo(account) {
    setForm({ email: account.email, password: account.password })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Could not log in. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="card auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Log in</h1>
        <p className="auth-sub">Pick up your trips right where you left them.</p>

        {error && <div className="banner-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Trao? <Link to="/register">Create an account</Link>
        </p>

        <div className="demo-panel">
          <span className="eyebrow">Demo accounts (no signup needed)</span>
          {DEMO_ACCOUNTS.map((account) => (
            <button
              type="button"
              key={account.email}
              className="demo-account-btn"
              onClick={() => fillDemo(account)}
            >
              <span>{account.name}</span>
              <span className="demo-account-email">{account.email}</span>
            </button>
          ))}
          <p className="demo-hint">Password for both: <code>demo1234</code></p>
        </div>
      </div>
    </main>
  )
}
