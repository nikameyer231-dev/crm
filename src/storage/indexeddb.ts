import { openDB } from 'idb'

const DB_NAME = 'employee-crm'
const DB_VERSION = 1
const STORE_NAMES = {
  clients: 'clients',
  invoices: 'invoices',
  templates: 'templates',
  patches: 'patches'
}

let dbPromise: any = null
export function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_NAMES.clients, { keyPath: 'id' })
        db.createObjectStore(STORE_NAMES.invoices, { keyPath: 'id' })
        db.createObjectStore(STORE_NAMES.templates, { keyPath: 'id' })
        db.createObjectStore(STORE_NAMES.patches, { autoIncrement: true })
      }
    })
  }
  return dbPromise
}

export async function getAll(storeName: keyof typeof STORE_NAMES) {
  const d = await db()
  return d.getAll(STORE_NAMES[storeName])
}
export async function put(storeName: keyof typeof STORE_NAMES, item: any) {
  const d = await db()
  return d.put(STORE_NAMES[storeName], item)
}
export async function addPatch(patch: any) {
  const d = await db()
  return d.add(STORE_NAMES.patches, patch)
}
export async function getPatches() {
  const d = await db()
  return d.getAll(STORE_NAMES.patches)
}
export async function clearPatches() {
  const d = await db()
  return d.clear(STORE_NAMES.patches)
}