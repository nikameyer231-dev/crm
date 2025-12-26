// Drive infra (local-only stub)
// ------------------------------------------------------------------
// For now Google Drive sync is disabled. This file provides NO-OP or
// local-only stubs so UI and background code can call the functions
// without triggering network requests or requiring OAuth.
// ------------------------------------------------------------------
// When you're ready to re-enable Drive sync:
//  - Restore the original implementations (see previous scaffold or spec).
//  - Ensure getAuthToken is available and oauth2.client_id is set in manifest.
//  - Implement push/pull using findWorkspaceFile / downloadFile / uploadFile
//    with optimistic concurrency (ETag / If-Match).
//
// The functions below return predictable values or throw only for invalid usage.

import { getAuthToken } from './auth' // kept for future use (unused currently)
export const MAX_PATCH_BATCH = 50

// Keep API compatibility with previous drive.ts signatures.
// These implementations are intentionally conservative and local-only.

/**
 * findWorkspaceFile(workspaceId)
 * Local stub: returns null to indicate no remote workspace file exists.
 */
export async function findWorkspaceFile(workspaceId: string) {
  console.info('[drive] findWorkspaceFile called (local-only mode) — returning null')
  return null
}

/**
 * downloadFile(fileId)
 * Local stub: not available while Drive sync is disabled.
 */
export async function downloadFile(fileId: string) {
  throw new Error('Drive download is disabled in local-only mode')
}

/**
 * uploadFile(fileId, body, ifMatch)
 * Local stub: not available while Drive sync is disabled.
 */
export async function uploadFile(fileId: string, body: any, ifMatch?: string) {
  throw new Error('Drive upload is disabled in local-only mode')
}

/**
 * createWorkspaceFile(workspaceId, body)
 * Local stub: not available while Drive sync is disabled.
 */
export async function createWorkspaceFile(workspaceId: string, body: any) {
  throw new Error('Drive create is disabled in local-only mode')
}

/**
 * syncPatches(patches)
 * Keep a no-op implementation for compatibility. Callers (UI) can still
 * enqueue patches with the legacy adapter (drive.legacy.syncPatches) which
 * persists them to IndexedDB. The background worker processes/clears patches locally.
 */
export async function syncPatches(patches: any[]) {
  if (!Array.isArray(patches)) throw new Error('patches must be an array')
  if (patches.length === 0) return
  if (patches.length > MAX_PATCH_BATCH) {
    console.warn('[drive] Too many changes; batching recommended (local-only mode)')
  }
  console.info(`[drive] syncPatches called with ${patches.length} patch(es) (local-only mode). No remote upload performed.`)
  // Intentionally do not attempt network operations here.
}
