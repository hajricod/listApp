import { useState, useEffect, useRef } from 'react'
import { useApp, useT } from '../AppContext.js'

const COLOR_OPTIONS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6']

export default function GroupModal() {
  const { state, groupModal, closeGroupModal, createOrUpdateGroup } = useApp()
  const t = useT()
  const { open, editId } = groupModal

  const [name, setName] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const nameRef = useRef(null)

  useEffect(() => {
    if (!open) return
    if (editId) {
      const g = state.groups.find((g) => g.id === editId)
      if (g) { setName(g.name); setColor(g.color) }
    } else {
      setName(''); setColor('#3b82f6')
    }
    setTimeout(() => nameRef.current?.focus(), 30)
  }, [open, editId, state.groups])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    createOrUpdateGroup(trimmed, color, editId || null)
    closeGroupModal()
  }

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) closeGroupModal() }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <h3>{editId ? t('modal-title-edit') : t('modal-title-add')}</h3>
          <button className="btn-close-modal" onClick={closeGroupModal} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('label-group-name')}</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('group-name-placeholder')}
              required
              maxLength={30}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>{t('label-accent-color')}</label>
            <div className="color-picker-grid">
              {COLOR_OPTIONS.map((c) => (
                <label key={c} className="color-swatch-container">
                  <input type="radio" name="group-color" value={c} checked={color === c} onChange={() => setColor(c)} />
                  <span className="color-swatch" style={{ backgroundColor: c }} />
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeGroupModal}>{t('btn-cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('btn-save')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
