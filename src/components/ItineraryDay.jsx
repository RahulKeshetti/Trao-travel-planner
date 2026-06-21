import { useState } from 'react'
import ActivityItem from './ActivityItem.jsx'

export default function ItineraryDay({
  day,
  dragOverActivityId,
  onDragStart,
  onDropOnActivity,
  onDropOnDayEnd,
  onDragEnter,
  onDragLeave,
  onRemoveActivity,
  onAddActivity,
  onOpenRegenerate
}) {
  const [newActivity, setNewActivity] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!newActivity.trim()) return
    onAddActivity(day.day, newActivity.trim())
    setNewActivity('')
  }

  return (
    <article className="card day-stub">
      <div className="day-stub-header">
        <div className="day-stamp">
          <span className="day-stamp-label">Day</span>
          <span className="day-stamp-number">{String(day.day).padStart(2, '0')}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => onOpenRegenerate(day.day)}>
          Regenerate day
        </button>
      </div>

      <div className="day-stub-perforation" />

      <ul
        className="activity-list"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDropOnDayEnd(e, day.day)}
      >
        {day.activities.length === 0 && (
          <li className="activity-empty">No activities yet — add one below.</li>
        )}
        {day.activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            dayNumber={day.day}
            isDragOver={dragOverActivityId === activity.id}
            onDragStart={onDragStart}
            onDrop={onDropOnActivity}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onRemove={onRemoveActivity}
          />
        ))}
      </ul>

      <form className="activity-add" onSubmit={handleAdd}>
        <input
          placeholder="Add an activity…"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          aria-label={`Add activity to day ${day.day}`}
        />
        <button className="btn btn-ghost btn-sm" type="submit">
          Add
        </button>
      </form>
    </article>
  )
}
