// Utility to import SAMPLE_WORKSPACE into local IndexedDB stores
import { SAMPLE_WORKSPACE } from './sampleWorkspace'
import { put } from '../storage/indexeddb'

type ImportResult = {
  clients: number
  invoices: number
  templates: number
}

export async function importSampleWorkspace(): Promise<ImportResult> {
  const clients = SAMPLE_WORKSPACE.clients || []
  const invoices = SAMPLE_WORKSPACE.invoices || []
  const templates = SAMPLE_WORKSPACE.templates || []

  // Persist each item into the idb stores
  for (const c of clients) {
    await put('clients', c)
  }
  for (const i of invoices) {
    await put('invoices', i)
  }
  for (const t of templates) {
    await put('templates', t)
  }

  // Return counts so UI can show status
  return {
    clients: clients.length,
    invoices: invoices.length,
    templates: templates.length
  }
}