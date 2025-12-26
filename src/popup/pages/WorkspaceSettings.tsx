import React, { useState } from 'react'
import { importSampleWorkspace } from '../../sample/importSample'

export default function WorkspaceSettings(){
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function handleLoadSample() {
    setStatus(null)
    setLoading(true)
    try {
      const result = await importSampleWorkspace()
      setStatus(`Imported: ${result.clients} clients, ${result.invoices} invoices, ${result.templates} templates`)
    } catch (err: any) {
      setStatus(`Import failed: ${err?.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Workspace Settings</h2>
      <p>Admin actions for workspace management.</p>

      <section style={{marginTop:12}}>
        <h3>Sample Data</h3>
        <p>Load example dataset into local IndexedDB (for testing/demo).</p>
        <button onClick={handleLoadSample} disabled={loading} style={{padding:'8px 12px',borderRadius:6}}>
          {loading ? 'Importing…' : 'Load Example Data'}
        </button>
        {status && <div style={{marginTop:8}}>{status}</div>}
      </section>
    </div>
  )
}