import { DEFAULT_GROUPS_EN, DEFAULT_GROUPS_AR } from './translations.js'

const IDB_DB_NAME = 'tasksphere-idb'
const IDB_STORE = 'sqlitedb'
const IDB_KEY = 'db'

function openIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB_NAME, 1)
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(IDB_STORE)
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

function idbLoad() {
  return openIdb().then(
    (idb) =>
      new Promise((resolve, reject) => {
        const tx = idb.transaction(IDB_STORE, 'readonly')
        const req = tx.objectStore(IDB_STORE).get(IDB_KEY)
        req.onsuccess = (e) => resolve(e.target.result || null)
        req.onerror = (e) => reject(e.target.error)
      })
  )
}

function idbSave(data) {
  return openIdb().then(
    (idb) =>
      new Promise((resolve, reject) => {
        const tx = idb.transaction(IDB_STORE, 'readwrite')
        const req = tx.objectStore(IDB_STORE).put(data, IDB_KEY)
        req.onsuccess = () => resolve()
        req.onerror = (e) => reject(e.target.error)
      })
  )
}

export function persistDatabase(db) {
  if (!db) return Promise.resolve()
  return idbSave(db.export())
}

export function createSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, color TEXT NOT NULL, sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY, group_id TEXT NOT NULL, name TEXT NOT NULL, sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY, list_id TEXT NOT NULL, text TEXT NOT NULL,
      completed INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `)
}

export function seedDefaults(db, lang) {
  const defaults = lang === 'ar' ? DEFAULT_GROUPS_AR : DEFAULT_GROUPS_EN
  defaults.forEach((group, gi) => {
    db.run('INSERT OR IGNORE INTO groups (id,name,color,sort_order) VALUES (?,?,?,?)', [group.id, group.name, group.color, gi])
    group.lists.forEach((list, li) => {
      db.run('INSERT OR IGNORE INTO lists (id,group_id,name,sort_order) VALUES (?,?,?,?)', [list.id, group.id, list.name, li])
      list.items.forEach((item, ii) => {
        db.run('INSERT OR IGNORE INTO items (id,list_id,text,completed,sort_order) VALUES (?,?,?,?,?)', [
          item.id, list.id, item.text, item.completed ? 1 : 0, ii,
        ])
      })
    })
  })
  db.run("INSERT OR IGNORE INTO settings (key,value) VALUES ('theme','dark')")
  db.run(`INSERT OR IGNORE INTO settings (key,value) VALUES ('language','${lang}')`)
}

function migrateFromLocalStorage(db) {
  const raw = localStorage.getItem('tasksphere_state')
  if (!raw) return false
  try {
    const old = JSON.parse(raw)
    const lang = old.language || 'en'
    const theme = old.theme || 'dark'
    ;(old.groups || []).forEach((group, gi) => {
      db.run('INSERT OR IGNORE INTO groups (id,name,color,sort_order) VALUES (?,?,?,?)', [group.id, group.name, group.color, gi])
      ;(group.lists || []).forEach((list, li) => {
        db.run('INSERT OR IGNORE INTO lists (id,group_id,name,sort_order) VALUES (?,?,?,?)', [list.id, group.id, list.name, li])
        ;(list.items || []).forEach((item, ii) => {
          db.run('INSERT OR IGNORE INTO items (id,list_id,text,completed,sort_order) VALUES (?,?,?,?,?)', [
            item.id, list.id, item.text, item.completed ? 1 : 0, ii,
          ])
        })
      })
    })
    db.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('theme',?)", [theme])
    db.run("INSERT OR REPLACE INTO settings (key,value) VALUES ('language',?)", [lang])
    localStorage.removeItem('tasksphere_state')
    console.log('[TaskSphere] Migrated from localStorage to SQLite')
    return true
  } catch (e) {
    console.warn('[TaskSphere] Migration failed', e)
    return false
  }
}

export function loadStateFromDB(db) {
  const state = { groups: [], activeGroupId: null, theme: 'dark', language: 'en' }

  const settingsRows = db.exec('SELECT key, value FROM settings')
  if (settingsRows.length > 0) {
    settingsRows[0].values.forEach(([key, value]) => {
      if (key === 'theme') state.theme = value
      if (key === 'language') state.language = value
      if (key === 'activeGroupId') state.activeGroupId = value
    })
  }

  const groupRows = db.exec('SELECT id, name, color FROM groups ORDER BY sort_order ASC')
  if (groupRows.length > 0) {
    groupRows[0].values.forEach(([id, name, color]) => state.groups.push({ id, name, color, lists: [] }))
  }

  const listRows = db.exec('SELECT id, group_id, name FROM lists ORDER BY sort_order ASC')
  if (listRows.length > 0) {
    listRows[0].values.forEach(([id, group_id, name]) => {
      const group = state.groups.find((g) => g.id === group_id)
      if (group) group.lists.push({ id, name, items: [] })
    })
  }

  const itemRows = db.exec('SELECT id, list_id, text, completed FROM items ORDER BY sort_order ASC')
  if (itemRows.length > 0) {
    itemRows[0].values.forEach(([id, list_id, text, completed]) => {
      state.groups.forEach((g) => {
        const list = g.lists.find((l) => l.id === list_id)
        if (list) list.items.push({ id, text, completed: completed === 1 })
      })
    })
  }

  if (!state.groups.some((g) => g.id === state.activeGroupId) && state.groups.length > 0) {
    state.activeGroupId = state.groups[0].id
  }

  return state
}

export async function initDatabase(initialLanguage = 'en') {
  const SQL = await window.initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/${file}`,
  })

  const savedBuffer = await idbLoad()
  let db
  if (savedBuffer) {
    db = new SQL.Database(savedBuffer)
    createSchema(db)
    console.log('[TaskSphere] DB restored from IndexedDB')
  } else {
    db = new SQL.Database()
    createSchema(db)
    if (!migrateFromLocalStorage(db)) {
      seedDefaults(db, initialLanguage)
      console.log('[TaskSphere] DB seeded with defaults')
    }
    await persistDatabase(db)
  }

  const state = loadStateFromDB(db)
  return { db, state }
}
