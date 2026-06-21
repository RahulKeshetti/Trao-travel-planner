export default function ActivityItem({ activity, dayNumber, onDragStart, onDrop, onRemove, isDragOver, onDragEnter, onDragLeave }) {
  return (
    <li
      className={`activity-item ${isDragOver ? 'is-drag-over' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, dayNumber, activity.id)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => onDragEnter(activity.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, dayNumber, activity.id)}
    >
      <span className="activity-handle" aria-hidden="true">⠿</span>
      <span className="activity-title">{activity.title}</span>
      <button
        type="button"
        className="activity-remove"
        aria-label={`Remove ${activity.title}`}
        onClick={() => onRemove(dayNumber, activity.id)}
      >
        ×
      </button>
    </li>
  )
}
