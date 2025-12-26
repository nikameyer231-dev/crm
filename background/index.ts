// Background service worker: for now Google Drive sync is disabled.
// The worker will process pending patches locally (clear them) and notify UI clients
// about SYNC_STATE transitions. Re-enable remote sync later by restoring calls to
// drive.pushPatches / drive.uploadFile once drive auth is configured.

import { getPatches, clearPatches } from '../src/storage/indexeddb'
// Note: we intentionally do NOT import or call remote drive APIs here while Google sync is disabled.
// import { pushPatches } from '../src/infra/drive.legacy' // <-- restore when enabling remote sync

// Note: service worker lifecycle in MV3 is ephemeral. Keep tasks short.
self.addEventListener('install', () => {
  // @ts-ignore
  self.skipWaiting && self.skipWaiting()
})

self.addEventListener('activate', () => {
  // @ts-ignore
  self.clients?.claim && self.clients.claim()
})

self.addEventListener('message', async (ev: any) => {
  const data = ev.data || {}
  if (data.type !== 'RUN_SYNC') return

  const notify = async (payload: any) => {
    try {
      const clients = await (self as any).clients.matchAll()
      clients.forEach((c: any) => c.postMessage(payload))
    } catch (err) {
      console.warn('Background: failed to notify clients', err)
    }
  }

  await notify({ type: 'SYNC_STATE', state: 'syncing' })

  try {
    const patches = await getPatches()
    if (!patches || patches.length === 0) {
      console.log('Background: no patches to sync (local-only mode)')
      await notify({ type: 'SYNC_STATE', state: 'idle' })
      return
    }

    // LOCAL-ONLY MODE: process patches locally (demo)
    // We do NOT push to Google Drive while sync is disabled.
    // A simple local processing approach is to mark patches as handled by clearing them.
    // In production, you would call a real pushPatches(...) that uploads to Drive and
    // handles conflicts/ETags. Re-enable remote sync by calling pushPatches(...) here.
    console.log(`Background: processing ${patches.length} local patches (local-only mode)`) 

    // Simulate short processing latency
    await new Promise((r) => setTimeout(r, 200))

    // Clear persisted patches after "processing" them locally.
    try {
      await clearPatches()
    } catch (err) {
      console.warn('Background: failed to clear patches', err)
    }

    await notify({ type: 'SYNC_STATE', state: 'idle' })
  } catch (err) {
    console.error('Background: local processing failed', err)
    await notify({ type: 'SYNC_STATE', state: 'error' })
  }
})
