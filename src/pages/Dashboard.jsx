import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/Loader.jsx'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .fetchTrips()
      .then((res) => setTrips(res.trips))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(tripId) {
    const confirmed = window.confirm('Remove this trip? This cannot be undone.')
    if (!confirmed) return
    try {
      await api.deleteTrip(tripId)
      setTrips((prev) => prev.filter((t) => t.id !== tripId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="page-shell">
      <div className="dash-header">
        <div>
          <span className="eyebrow">Hello, {user?.name?.split(' ')[0] || 'traveler'}</span>
          <h1>My trips</h1>
        </div>
        <Link to="/trips/new" className="btn btn-accent">
          + Plan a new trip
        </Link>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {loading ? (
        <Loader label="Fetching your trips…" />
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <h3>No trips yet</h3>
          <p>Plan your first destination and let the AI agent put together the days.</p>
          <Link to="/trips/new" className="btn btn-primary">
            Start planning
          </Link>
        </div>
      ) : (
        <div className="dash-grid">
          {trips.map((trip) => (
            <article className="card trip-card" key={trip.id}>
              <div className="trip-card-top">
                <h3 className="trip-destination">{trip.destination}</h3>
              </div>
              <div className="trip-meta">
                <span>{trip.days} day{trip.days > 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{trip.budgetType} budget</span>
                <span>·</span>
                <span>${trip.budget?.total} est.</span>
              </div>
              <div className="trip-tags">
                {trip.interests?.map((i) => (
                  <span className="trip-tag" key={i}>
                    {i}
                  </span>
                ))}
              </div>
              <div className="trip-card-actions">
                <Link to={`/trips/${trip.id}`} className="btn btn-ghost btn-sm">
                  Open itinerary
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(trip.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
