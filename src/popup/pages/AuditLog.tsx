import React from 'react'

export default function AuditLog(){ 
  return (
    <div>
      <h2>Audit Log</h2>
      <p>Audit entries will appear here (append-only actions: create/update/delete/print).</p>
      <small>Audit log is stored in the workspace snapshot / indexedDB for now.</small>
    </div>
  )
}