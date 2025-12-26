// Converted from original minimal drive.ts
// Provides a very small adapter that stores patches locally and triggers background sync.
// This is intentionally lightweight — extend with actual Drive delta logic in infra/drive.ts

import { addPatch } from '../storage/indexeddb'

export const MAX_PATCH_BATCH = 50

/**
 * Accepts an array of patches and stores them to the patches store.
 * If too many patches, logs a warning — in production you'd split into batches.
 */
export async function syncPatches(patches: any[]) {
  if (!Array.isArray(patches)) throw new Error('patches must be an array')
  if (patches.length === 0) return

  if (patches.length > MAX_PATCH_BATCH) {
    // legacy behavior: warn and still enqueue
    console.warn('Too many changes, syncing in batches (legacy adapter)')
  }

  // persist patches to IndexedDB (background worker or manual sync should pick them up)
  for (const p of patches) {
    try {
      await addPatch(p)
    } catch (err) {
      console.error('Failed to persist patch', err)
    }
  }

  // Signal background service worker to run a sync (best-effort)
  try {
    // Use chrome.runtime to message the service worker. Background can listen for this
    chrome.runtime.sendMessage({ type: 'RUN_SYNC' })
  } catch (err) {
    console.warn('Could not notify background service worker to sync', err)
  }
}