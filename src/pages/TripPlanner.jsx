import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TripForm from '../components/TripForm.jsx'
import Loader from '../components/Loader.jsx'
import * as api from '../services/api.js'
import './TripPlanner.css'

export default function TripPlanner() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(payload) {
    setError('')
    setSubmitting(true)
    try {
      const res = await api.generateItinerary(payload)
      navigate(`/trips/${res.trip.id}`)
    } catch (err) {
      setError(err.message || 'The AI agent could not build this itinerary. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell planner-shell">
      {submitting ? (
        <div className="planner-loading">
          <Loader label="The AI agent is drafting your day-by-day plan…" />
        </div>
      ) : (
        <div>
          <span className="eyebrow">New trip</span>
          <h1>Where are we headed?</h1>
          {error && <div className="banner-error">{error}</div>}
          <TripForm onSubmit={handleSubmit} submitting={submitting} />
        </div>
      )}
    </main>
  )
}
