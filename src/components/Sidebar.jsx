import { useState } from 'react'
import { useApp, useT } from '../AppContext.js'
import { hexToRgbString } from '../utils.js'

export default function Sidebar() {
  const { state, toggleTheme, toggleLanguage, openGroupModal, sidebarOpen } = useApp()
  const t = useT()

  return (
    <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
      {/* ── Header ── */}
      <div className="sidebar-header">
        <div className="logo-area">
          <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <h1>TaskSphere</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            id="install-button"
            className="theme-toggle-btn"
            aria-label="Install app"
            title="Install TaskSphere on your device"
            style={{ display: 'none', fontWeight: 600 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            className="theme-toggle-btn"
            onClick={toggleLanguage}
            aria-label="Switch language"
            style={{ fontWeight: 800, fontSize: '0.75rem', fontFamily: 'var(--font-heading)' }}
          >
            {state.language === 'en' ? 'AR' : 'EN'}
          </button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {/* Sun – shown in dark mode */}
            <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            {/* Moon – shown in light mode */}
            <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Groups list ── */}
      <div className="sidebar-section">
        <div className="section-title-row">
          <h2>{t('groups-title')}</h2>
          <button className="icon-btn-primary" onClick={() => openGroupModal()} aria-label={t('create-group-tooltip')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <nav className="groups-list" aria-label="List Groups">
          {state.groups.map((group) => (
            <GroupItem key={group.id} group={group} />
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <span className="app-version">v1.0.0</span>
        <span className="app-signature">© TaskSphere</span>
      </div>
    </aside>
  )
}

function GroupItem({ group }) {
  const { state, setActiveGroup, openGroupModal, reorderGroups } = useApp()
  const [dragging, setDragging] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const totalItems = group.lists.reduce((s, l) => s + l.items.length, 0)
  const completedItems = group.lists.reduce((s, l) => s + l.items.filter((i) => i.completed).length, 0)
  const isActive = group.id === state.activeGroupId

  return (
    <div
      className={`group-item-link${isActive ? ' active' : ''}${dragging ? ' dragging' : ''}${dragOver ? ' drag-over' : ''}`}
      style={{ '--group-accent': group.color, '--group-accent-rgb': hexToRgbString(group.color) }}
      draggable
      onDragStart={(e) => { setDragging(true); e.dataTransfer.setData('text/plain', group.id); e.dataTransfer.effectAllowed = 'move' }}
      onDragEnd={() => { setDragging(false); setDragOver(false) }}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const id = e.dataTransfer.getData('text/plain'); if (id && id !== group.id) reorderGroups(id, group.id) }}
      onClick={(e) => { if (e.target.closest('.group-actions-btn')) return; setActiveGroup(group.id) }}
    >
      <div className="group-item-left">
        <span className="group-color-dot" style={{ backgroundColor: group.color, '--dot-color': group.color }} />
        <span className="group-item-name" title={group.name}>{group.name}</span>
      </div>
      <div className="group-item-right">
        <span className="group-item-count">{completedItems}/{totalItems}</span>
        <button className="group-actions-btn" onClick={(e) => { e.stopPropagation(); openGroupModal(group.id) }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
