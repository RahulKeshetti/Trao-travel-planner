import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logo from '../assets/trao-logo.png'
import './Navbar.css'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="nav-brand">
          <img src={logo} alt="Trao" className="nav-logo" />
        </Link>

        {isAuthenticated ? (
          <nav className="nav-links">
            <Link to="/dashboard">My Trips</Link>
            <Link to="/trips/new" className="btn btn-accent btn-sm">
              + New Trip
            </Link>
            <span className="nav-user">{user?.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </nav>
        ) : (
          <nav className="nav-links">
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
