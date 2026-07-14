import { useState, useEffect } from 'react'
import { useApp, useT } from '../AppContext.js'
import { usePointerSort } from '../hooks/usePointerSort.js'
import ListCard from './ListCard.jsx'
import EmptyState from './EmptyState.jsx'
import AddListCard from './AddListCard.jsx'

const LS_COLS = 'tasksphere_cols'

export default function MainPanel() {
  const { state, openGroupModal, deleteGroup, openConfirmModal, reorderLists } = useApp()
  const t = useT()
  const [cols, setCols] = useState(() => {
    const v = parseInt(localStorage.getItem(LS_COLS), 10)
    return isNaN(v) ? 0 : v
  })

  const { activeId: activeCardId, overId: overCardId, startDrag: startCardDrag } = usePointerSort(
    (srcId, tgtId) => reorderLists(state.activeGroupId, srcId, tgtId)
  )

  useEffect(() => {
    localStorage.setItem(LS_COLS, String(cols))
  }, [cols])

  if (state.groups.length === 0) {
    return (
      <main className="main-panel">
        <EmptyState />
      </main>
    )
  }

  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId)
  if (!activeGroup) return <main className="main-panel" />

  const totalItems = activeGroup.lists.reduce((s, l) => s + l.items.length, 0)
  const completedItems = activeGroup.lists.reduce((s, l) => s + l.items.filter((i) => i.completed).length, 0)
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  function handleDelete() {
    openConfirmModal({
      title: t('delete-group'),
      message: t('confirm-delete-group'),
      onConfirm: () => deleteGroup(activeGroup.id),
    })
  }

  return (
    <main className="main-panel">
      <section className="group-workspace">
        {/* ── Group header ── */}
        <header className="group-header">
          <div className="group-header-info">
            <div className="group-title-row">
              <span className="group-accent-bar" style={{ backgroundColor: activeGroup.color }} />
              <h2>{activeGroup.name}</h2>
            </div>
            <span className="group-stats-subtext">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {activeGroup.lists.length} {t('lists')} &bull; {completionRate}% {t('tasks-completed')} ({completedItems}/{totalItems})
            </span>
          </div>
          <div className="group-actions-container">
            <div className="cols-picker" aria-label={t('cols-picker-label')}>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={`cols-btn${cols === n ? ' active' : ''}`}
                  title={t('cols-option', { n })}
                  onClick={() => setCols((prev) => (prev === n ? 0 : n))}
                >
                  <span className="cols-btn-grid" data-cols={n}>
                    {Array.from({ length: n }).map((_, i) => <span key={i} />)}
                  </span>
                </button>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={() => openGroupModal(activeGroup.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              {t('edit-group')}
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              {t('delete-group')}
            </button>
          </div>
        </header>

        {/* ── Lists grid ── */}
        <div
          className="lists-grid"
          style={cols > 0 ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
        >
          {activeGroup.lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              groupId={activeGroup.id}
              groupColor={activeGroup.color}
              startCardDrag={startCardDrag}
              isCardDragging={activeCardId === list.id}
              isCardDragOver={overCardId === list.id}
            />
          ))}
          <AddListCard groupId={activeGroup.id} />
        </div>
      </section>
    </main>
  )
}
