import { useState } from 'react'
import './Modal.css'

export default function RegenerateDayModal({ dayNumber, onClose, onConfirm, submitting }) {
  const [instructions, setInstructions] = useState('')

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Regenerate day ${dayNumber}`}>
      <div className="modal-card card">
        <h3>Regenerate Day {dayNumber}</h3>
        <p className="modal-sub">
          Tell the agent what to change. For example: "more outdoor activities" or "swap in something cheaper".
        </p>
        <textarea
          className="modal-textarea"
          rows={3}
          autoFocus
          placeholder="More outdoor activities…"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn btn-accent"
            onClick={() => onConfirm(instructions)}
            disabled={submitting}
          >
            {submitting ? 'Regenerating…' : 'Regenerate day'}
          </button>
        </div>
      </div>
    </div>
  )
}
