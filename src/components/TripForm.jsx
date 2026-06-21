import { useState } from 'react'
import './TripForm.css'

const BUDGET_OPTIONS = [
  { value: 'Low', hint: 'Hostels, street food' },
  { value: 'Medium', hint: 'Comfort, a few splurges' },
  { value: 'High', hint: 'Premium stays & dining' }
]

const INTEREST_OPTIONS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Relaxation', 'Nightlife']

export default function TripForm({ onSubmit, submitting }) {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(4)
  const [budgetType, setBudgetType] = useState('Medium')
  const [interests, setInterests] = useState(['Culture', 'Food'])
  const [touched, setTouched] = useState(false)

  function toggleInterest(option) {
    setInterests((prev) =>
      prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!destination.trim() || days < 1) return
    onSubmit({ destination: destination.trim(), days: Number(days), budgetType, interests })
  }

  const destinationInvalid = touched && !destination.trim()

  return (
    <form className="card trip-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          placeholder="e.g. Tokyo, Japan"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          aria-invalid={destinationInvalid}
        />
        {destinationInvalid && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>Tell us where you're headed.</span>}
      </div>

      <div className="field">
        <label htmlFor="days">Number of days</label>
        <input
          id="days"
          type="number"
          min={1}
          max={21}
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Budget</label>
        <div className="budget-options" role="radiogroup" aria-label="Budget type">
          {BUDGET_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              role="radio"
              aria-checked={budgetType === opt.value}
              tabIndex={0}
              className={`budget-option ${budgetType === opt.value ? 'is-active' : ''}`}
              onClick={() => setBudgetType(opt.value)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setBudgetType(opt.value)}
            >
              <span className="budget-option-label">{opt.value}</span>
              <span className="budget-option-hint">{opt.hint}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Interests</label>
        <div className="interest-grid" role="group" aria-label="Interests">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt}
              className={`interest-chip ${interests.includes(opt) ? 'is-active' : ''}`}
              aria-pressed={interests.includes(opt)}
              onClick={() => toggleInterest(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-accent" type="submit" disabled={submitting}>
        {submitting ? 'Building your itinerary…' : 'Generate itinerary'}
      </button>
    </form>
  )
}
