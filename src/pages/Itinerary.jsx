import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as api from '../services/api.js'
import Loader from '../components/Loader.jsx'
import ItineraryDay from '../components/ItineraryDay.jsx'
import BudgetSummary from '../components/BudgetSummary.jsx'
import HotelSuggestions from '../components/HotelSuggestions.jsx'
import RegenerateDayModal from '../components/RegenerateDayModal.jsx'
import './Itinerary.css'

function reorderDays(days, source, target) {
  const next = days.map((d) => ({ ...d, activities: [...d.activities] }))
  const sourceDay = next.find((d) => d.day === source.dayNumber)
  const idx = sourceDay.activities.findIndex((a) => a.id === source.activityId)
  if (idx === -1) return days
  const [moved] = sourceDay.activities.splice(idx, 1)

  const targetDay = next.find((d) => d.day === target.dayNumber)
  if (target.activityId) {
    const targetIdx = targetDay.activities.findIndex((a) => a.id === target.activityId)
    targetDay.activities.splice(targetIdx, 0, moved)
  } else {
    targetDay.activities.push(moved)
  }
  return next
}

export default function Itinerary() {
  const { tripId } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [regenerateDayNumber, setRegenerateDayNumber] = useState(null)
  const [regenerating, setRegenerating] = useState(false)
  const [dragOverActivityId, setDragOverActivityId] = useState(null)

  const dragSourceRef = useRef(null)

  useEffect(() => {
    api
      .fetchTrip(tripId)
      .then((res) => setTrip(res.trip))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [tripId])

  function updateItineraryLocally(nextDays) {
    setTrip((prev) => ({ ...prev, itinerary: nextDays }))
  }

  /* ---------------- drag and drop reordering (creative feature) ---------------- */

  function handleDragStart(e, dayNumber, activityId) {
    dragSourceRef.current = { dayNumber, activityId }
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragEnter(activityId) {
    setDragOverActivityId(activityId)
  }

  function handleDragLeave() {
    setDragOverActivityId(null)
  }

  async function commitReorder(nextDays) {
    updateItineraryLocally(nextDays)
    setDragOverActivityId(null)
    try {
      await api.reorderItinerary(tripId, nextDays)
    } catch {
      setNotice('Reorder saved locally but failed to sync — it will retry on your next change.')
    }
  }

  function handleDropOnActivity(e, targetDayNumber, targetActivityId) {
    e.preventDefault()
    e.stopPropagation()
    const source = dragSourceRef.current
    if (!source) return
    if (source.dayNumber === targetDayNumber && source.activityId === targetActivityId) return
    const nextDays = reorderDays(trip.itinerary, source, { dayNumber: targetDayNumber, activityId: targetActivityId })
    commitReorder(nextDays)
  }

  function handleDropOnDayEnd(e, dayNumber) {
    e.preventDefault()
    const source = dragSourceRef.current
    if (!source) return
    const nextDays = reorderDays(trip.itinerary, source, { dayNumber, activityId: null })
    commitReorder(nextDays)
  }

  /* ---------------------------- activity CRUD ---------------------------- */

  async function handleAddActivity(dayNumber, title) {
    try {
      const res = await api.addActivity(tripId, dayNumber, title)
      setTrip(res.trip)
    } catch (err) {
      setNotice(err.message)
    }
  }

  async function handleRemoveActivity(dayNumber, activityId) {
    try {
      const res = await api.removeActivity(tripId, dayNumber, activityId)
      setTrip(res.trip)
    } catch (err) {
      setNotice(err.message)
    }
  }

  async function handleConfirmRegenerate(instructions) {
    setRegenerating(true)
    try {
      const res = await api.regenerateDay(tripId, regenerateDayNumber, instructions)
      setTrip(res.trip)
      setRegenerateDayNumber(null)
    } catch (err) {
      setNotice(err.message)
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <main className="page-shell">
        <Loader label="Loading itinerary…" />
      </main>
    )
  }

  if (error || !trip) {
    return (
      <main className="page-shell">
        <div className="banner-error">{error || 'Trip not found.'}</div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Back to my trips
        </button>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="itinerary-header">
        <div>
          <span className="eyebrow">{trip.budgetType} budget · {trip.days} days</span>
          <h1>{trip.destination}</h1>
        </div>
      </div>

      {notice && <div className="banner-info">{notice}</div>}

      <p className="dnd-hint">Drag the ⠿ handle to reorder activities — within a day or across days.</p>

      <div className="itinerary-layout">
        <div className="itinerary-days">
          {trip.itinerary.map((day) => (
            <ItineraryDay
              key={day.day}
              day={day}
              dragOverActivityId={dragOverActivityId}
              onDragStart={handleDragStart}
              onDropOnActivity={handleDropOnActivity}
              onDropOnDayEnd={handleDropOnDayEnd}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onOpenRegenerate={setRegenerateDayNumber}
            />
          ))}
        </div>

        <div className="itinerary-side">
          <BudgetSummary budget={trip.budget} />
        </div>
      </div>

      <HotelSuggestions hotels={trip.hotels} />

      {regenerateDayNumber && (
        <RegenerateDayModal
          dayNumber={regenerateDayNumber}
          submitting={regenerating}
          onClose={() => setRegenerateDayNumber(null)}
          onConfirm={handleConfirmRegenerate}
        />
      )}
    </main>
  )
}
