import { useApp, useT } from '../AppContext.js'

export default function ConfirmModal() {
  const { confirmModal, closeConfirmModal } = useApp()
  const t = useT()
  const { open, title, message, onConfirm, danger = true } = confirmModal

  if (!open) return null

  function handleConfirm() {
    onConfirm?.()
    closeConfirmModal()
  }

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) closeConfirmModal() }}
    >
      <div className="modal-card confirm-modal-card">
        <div className="confirm-modal-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-footer">
          <button className="btn btn-secondary" onClick={closeConfirmModal}>
            {t('btn-cancel')}
          </button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={handleConfirm}>
            {t('btn-confirm-delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
