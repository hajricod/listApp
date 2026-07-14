import { useState } from 'react'
import { useApp, useT } from '../AppContext.js'

export default function ListCard({ list, groupId, groupColor }) {
  const { state, renameList, deleteList, addItem, toggleItemCompletion, deleteItem, editItem, reorderLists, openConfirmModal } = useApp()
  const t = useT()
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')
  const [itemText, setItemText] = useState('')
  const [dragging, setDragging] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [editingItemText, setEditingItemText] = useState('')

  function startEditItem(item) { setEditingItemId(item.id); setEditingItemText(item.text) }
  function finishEditItem(groupId, listId, itemId) {
    const v = editingItemText.trim()
    if (v && v !== list.items.find((i) => i.id === itemId)?.text) editItem(groupId, listId, itemId, v)
    setEditingItemId(null)
  }

  const total = list.items.length
  const done = list.items.filter((i) => i.completed).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const gradDir = state.language === 'ar' ? '270deg' : '90deg'

  function startRename() { setNewName(list.name); setRenaming(true) }
  function finishRename() {
    const v = newName.trim()
    if (v && v !== list.name) renameList(groupId, list.id, v)
    setRenaming(false)
  }
  function handleDeleteList() {
    openConfirmModal({
      title: t('delete-list'),
      message: t('confirm-delete-list', { name: list.name }),
      onConfirm: () => deleteList(groupId, list.id),
    })
  }
  function handleAddItem(e) {
    e.preventDefault()
    const v = itemText.trim()
    if (v) { addItem(groupId, list.id, v); setItemText('') }
  }

  return (
    <div
      className={`list-card${dragging ? ' dragging' : ''}${dragOver ? ' drag-over' : ''}`}
      data-list-id={list.id}
      draggable
      onDragStart={(e) => { setDragging(true); e.dataTransfer.setData('text/plain', list.id); e.dataTransfer.effectAllowed = 'move' }}
      onDragEnd={() => { setDragging(false); setDragOver(false) }}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const id = e.dataTransfer.getData('text/plain'); if (id && id !== list.id) reorderLists(groupId, id, list.id) }}
    >
      {/* ── Header ── */}
      <div className="list-card-header">
        <div className="list-title-area">
          {renaming ? (
            <input
              type="text"
              className="inline-edit-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') finishRename(); if (e.key === 'Escape') setRenaming(false) }}
              onBlur={finishRename}
              maxLength={40}
              autoFocus
            />
          ) : (
            <h3 className="list-title-text" onDoubleClick={startRename}>{list.name}</h3>
          )}
        </div>
        <div className="list-card-header-actions">
          <button className="list-action-btn btn-rename-list" title={t('rename-list')} onClick={startRename}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
          <button className="list-action-btn btn-delete-list" title={t('delete-list')} onClick={handleDeleteList}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="list-progress-container">
        <div className="list-progress-stats">
          <span>{t('progress')}</span>
          <span>{pct}% ({done}/{total})</span>
        </div>
        <div className="list-progress-bar-track">
          <div
            className="list-progress-bar-fill"
            style={{ width: `${pct}%`, background: `linear-gradient(${gradDir}, ${groupColor}d0, ${groupColor})` }}
          />
        </div>
      </div>

      {/* ── Items ── */}
      <div className="checklist-items">
        {list.items.length === 0 ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'block', textAlign: 'center', padding: '12px 0' }}>
            {t('no-items')}
          </span>
        ) : (
          list.items.map((item) => (
            <div key={item.id} className="checklist-item">
              <label className="item-left-label">
                <input
                  type="checkbox"
                  className="checkbox-native"
                  checked={item.completed}
                  onChange={(e) => toggleItemCompletion(groupId, list.id, item.id, e.target.checked)}
                />
                <span className="checkbox-custom">
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                {editingItemId === item.id ? (
                  <input
                    type="text"
                    className="inline-edit-input"
                    value={editingItemText}
                    onChange={(e) => setEditingItemText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') finishEditItem(groupId, list.id, item.id); if (e.key === 'Escape') setEditingItemId(null) }}
                    onBlur={() => finishEditItem(groupId, list.id, item.id)}
                    maxLength={100}
                    autoFocus
                  />
                ) : (
                  <span className="item-text" onDoubleClick={() => startEditItem(item)}>{item.text}</span>
                )}
              </label>
              <div className="item-actions">
                <button className="btn-edit-item" title={t('edit-item')}
                  onClick={() => startEditItem(item)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button className="btn-delete-item" title={t('delete-item')}
                  onClick={() => openConfirmModal({
                    title: t('delete-item'),
                    message: t('confirm-delete-item', { name: item.text }),
                    onConfirm: () => deleteItem(groupId, list.id, item.id),
                  })}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add item ── */}
      <form className="add-item-form" onSubmit={handleAddItem}>
        <input
          type="text"
          className="add-item-input"
          placeholder={t('add-item-placeholder')}
          value={itemText}
          onChange={(e) => setItemText(e.target.value)}
          maxLength={100}
          autoComplete="off"
        />
        <button type="submit" className="btn-add-item-submit" aria-label={t('add-item-placeholder')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </form>
    </div>
  )
}
