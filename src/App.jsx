import { useState, useEffect, useRef } from 'react'
import { initDatabase, loadStateFromDB, persistDatabase } from './db.js'
import { t as tFn, DEFAULT_GROUPS_EN } from './translations.js'
import { uuid, hexToRgb } from './utils.js'
import { useConfetti } from './hooks/useConfetti.js'
import { AppContext } from './AppContext.js'
import Sidebar from './components/Sidebar.jsx'
import MainPanel from './components/MainPanel.jsx'
import GroupModal from './components/GroupModal.jsx'

export default function App() {
  const [state, setState] = useState({
    groups: [],
    activeGroupId: null,
    theme: 'dark',
    language: 'en',
  })
  const dbRef = useRef(null)
  const [groupModal, setGroupModal] = useState({ open: false, editId: null })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { canvasRef: confettiRef, triggerConfetti } = useConfetti()

  /* ── DB init ── */
  useEffect(() => {
    let cancelled = false
    initDatabase('en')
      .then(({ db, state: loaded }) => {
        if (cancelled) return
        dbRef.current = db
        setState(loaded)
      })
      .catch((err) => {
        console.error('[TaskSphere] DB init failed:', err)
        if (cancelled) return
        const groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS_EN))
        setState({ groups, activeGroupId: groups[0].id, theme: 'dark', language: 'en' })
      })
    return () => { cancelled = true }
  }, [])

  /* ── Side-effects that apply state to the DOM ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', state.language)
    document.documentElement.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr')
  }, [state.language])

  useEffect(() => {
    const activeGroup = state.groups.find((g) => g.id === state.activeGroupId)
    if (activeGroup) {
      const { r, g, b } = hexToRgb(activeGroup.color)
      document.documentElement.style.setProperty('--group-accent', activeGroup.color)
      document.documentElement.style.setProperty('--group-accent-rgb', `${r}, ${g}, ${b}`)
    }
  }, [state.activeGroupId, state.groups])

  /* ── Confetti canvas resize ── */
  useEffect(() => {
    const canvas = confettiRef.current
    if (!canvas) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [confettiRef])

  /* ── Helpers ── */
  const db = () => dbRef.current

  function reloadState() {
    const d = db()
    if (d) setState(loadStateFromDB(d))
  }

  /* ── Group actions ── */
  function setActiveGroup(id) {
    setState((prev) => ({ ...prev, activeGroupId: id }))
    const d = db()
    if (d) {
      d.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('activeGroupId',?)", [id])
      persistDatabase(d)
    }
    setSidebarOpen(false)
  }

  function createOrUpdateGroup(name, color, id = null) {
    const d = db()
    if (!d) return
    if (id) {
      d.run('UPDATE groups SET name=?, color=? WHERE id=?', [name, color, id])
    } else {
      const newId = uuid()
      d.run('INSERT INTO groups (id,name,color,sort_order) VALUES (?,?,?,?)', [newId, name, color, state.groups.length])
      d.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('activeGroupId',?)", [newId])
    }
    persistDatabase(d).then(reloadState)
  }

  function deleteGroup(id) {
    const d = db()
    if (!d) return
    const lists = d.exec('SELECT id FROM lists WHERE group_id=?', [id])
    if (lists.length > 0) lists[0].values.forEach(([lid]) => d.run('DELETE FROM items WHERE list_id=?', [lid]))
    d.run('DELETE FROM lists WHERE group_id=?', [id])
    d.run('DELETE FROM groups WHERE id=?', [id])
    const next = loadStateFromDB(d)
    if (next.activeGroupId === id || !next.activeGroupId) {
      const first = next.groups.find((g) => g.id !== id)
      next.activeGroupId = first ? first.id : null
      if (next.activeGroupId)
        d.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('activeGroupId',?)", [next.activeGroupId])
    }
    persistDatabase(d).then(() => setState(loadStateFromDB(d)))
  }

  function reorderGroups(sourceId, targetId) {
    const d = db()
    if (!d) return
    const groups = [...state.groups]
    const si = groups.findIndex((g) => g.id === sourceId)
    const ti = groups.findIndex((g) => g.id === targetId)
    if (si === -1 || ti === -1) return
    const [item] = groups.splice(si, 1)
    groups.splice(ti, 0, item)
    groups.forEach((g, i) => d.run('UPDATE groups SET sort_order=? WHERE id=?', [i, g.id]))
    persistDatabase(d).then(() => setState(loadStateFromDB(d)))
  }

  /* ── List actions ── */
  function addList(groupId, name) {
    const d = db()
    if (!d) return
    const group = state.groups.find((g) => g.id === groupId)
    if (!group) return
    d.run('INSERT INTO lists (id,group_id,name,sort_order) VALUES (?,?,?,?)', [uuid(), groupId, name, group.lists.length])
    persistDatabase(d).then(reloadState)
  }

  function renameList(groupId, listId, newName) {
    const d = db()
    if (!d) return
    d.run('UPDATE lists SET name=? WHERE id=?', [newName, listId])
    persistDatabase(d).then(reloadState)
  }

  function deleteList(groupId, listId) {
    const d = db()
    if (!d) return
    d.run('DELETE FROM items WHERE list_id=?', [listId])
    d.run('DELETE FROM lists WHERE id=?', [listId])
    persistDatabase(d).then(reloadState)
  }

  function reorderLists(groupId, sourceListId, targetListId) {
    const d = db()
    if (!d) return
    const group = state.groups.find((g) => g.id === groupId)
    if (!group) return
    const lists = [...group.lists]
    const si = lists.findIndex((l) => l.id === sourceListId)
    const ti = lists.findIndex((l) => l.id === targetListId)
    if (si === -1 || ti === -1) return
    const [item] = lists.splice(si, 1)
    lists.splice(ti, 0, item)
    lists.forEach((l, i) => d.run('UPDATE lists SET sort_order=? WHERE id=?', [i, l.id]))
    persistDatabase(d).then(() => setState(loadStateFromDB(d)))
  }

  /* ── Item actions ── */
  function addItem(groupId, listId, text) {
    const d = db()
    if (!d) return
    const group = state.groups.find((g) => g.id === groupId)
    if (!group) return
    const list = group.lists.find((l) => l.id === listId)
    if (!list) return
    d.run('INSERT INTO items (id,list_id,text,completed,sort_order) VALUES (?,?,?,0,?)', [uuid(), listId, text, list.items.length])
    persistDatabase(d).then(reloadState)
  }

  function toggleItemCompletion(groupId, listId, itemId, completed) {
    const d = db()
    if (!d) return
    d.run('UPDATE items SET completed=? WHERE id=?', [completed ? 1 : 0, itemId])
    const newSt = loadStateFromDB(d)
    const group = newSt.groups.find((g) => g.id === groupId)
    let listComplete = false
    if (group) {
      const list = group.lists.find((l) => l.id === listId)
      listComplete = !!(list && list.items.length > 0 && completed && list.items.every((i) => i.completed))
    }
    persistDatabase(d).then(() => {
      if (listComplete) triggerConfetti(group?.color)
      setState(newSt)
    })
  }

  function deleteItem(groupId, listId, itemId) {
    const d = db()
    if (!d) return
    d.run('DELETE FROM items WHERE id=?', [itemId])
    persistDatabase(d).then(reloadState)
  }

  /* ── Theme / Language ── */
  function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    setState((prev) => ({ ...prev, theme: newTheme }))
    const d = db()
    if (d) { d.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('theme',?)", [newTheme]); persistDatabase(d) }
  }

  function toggleLanguage() {
    const newLang = state.language === 'en' ? 'ar' : 'en'
    setState((prev) => ({ ...prev, language: newLang }))
    const d = db()
    if (d) { d.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('language',?)", [newLang]); persistDatabase(d) }
  }

  const ctx = {
    state,
    t: tFn,
    groupModal,
    openGroupModal: (editId = null) => setGroupModal({ open: true, editId }),
    closeGroupModal: () => setGroupModal({ open: false, editId: null }),
    sidebarOpen,
    setSidebarOpen,
    setActiveGroup,
    createOrUpdateGroup,
    deleteGroup,
    reorderGroups,
    addList,
    renameList,
    deleteList,
    reorderLists,
    addItem,
    toggleItemCompletion,
    deleteItem,
    toggleTheme,
    toggleLanguage,
  }

  return (
    <AppContext.Provider value={ctx}>
      <canvas ref={confettiRef} id="confetti-canvas" />
      <div className="app-container">
        <button
          id="sidebar-toggle"
          className="sidebar-toggle-btn"
          aria-label="Toggle Navigation Sidebar"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Sidebar />
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        <MainPanel />
      </div>
      <GroupModal />
    </AppContext.Provider>
  )
}
