import { useApp, useT } from '../AppContext.js'

export default function EmptyState() {
  const { openGroupModal } = useApp()
  const t = useT()

  return (
    <section className="empty-state-view" style={{ display: 'flex' }}>
      <div className="empty-state-card">
        <div className="empty-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 8v8" /><path d="M8 12h8" />
          </svg>
        </div>
        <h2>{t('empty-title')}</h2>
        <p>{t('empty-desc')}</p>
        <button className="btn btn-primary btn-large" onClick={() => openGroupModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('btn-create-first-group')}
        </button>
      </div>
    </section>
  )
}
