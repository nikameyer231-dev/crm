import React from 'react'

export function SyncIndicator({state}:{state:'idle'|'syncing'|'error'}) {
  if(state === 'syncing') return <span title="Syncing">🔄 Syncing…</span>
  if(state === 'error') return <span title="Sync error">⚠ Sync error</span>
  return <span title="Synced">✔ Synced</span>
}