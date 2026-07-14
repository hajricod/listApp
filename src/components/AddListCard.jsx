import { useState } from 'react'
import { useApp, useT } from '../AppContext.js'

export default function AddListCard({ groupId }) {
  const { addList } = useApp()
  const t = useT()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) addList(groupId, trimmed)
    setAdding(false)
    setName('')
  }

  if (!adding) {
    return (
      <div className="add-list-card-trigger" onClick={() => setAdding(true)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setAdding(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>{t('add-new-list')}</span>
      </div>
    )
  }

  return (
    <div className="list-card">
      <div className="list-card-header" style={{ marginBottom: 0 }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {t('list-name-label')}
          </div>
          <input
            type="text"
            className="add-item-input"
            placeholder={t('list-name-placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={40}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => { setAdding(false); setName('') }}>
              {t('btn-cancel')}
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              {t('btn-create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
