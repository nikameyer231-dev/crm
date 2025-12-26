# Employee CRM Chrome Extension (Vite + React + MV3)

This repository is a Chrome Extension scaffold implementing a client-centric CRM popup widget, IndexedDB local storage, and a small background service worker.

IMPORTANT: Google Drive sync is currently DISABLED (local-only mode).
This branch/scaffold was adjusted to run without requiring Google OAuth while you build and test local functionality.
When you're ready to integrate remote sync again, restore the Drive sync code and set the OAuth client ID in `manifest.json`.

Quick notes about local-only mode
- The Drive infra files remain in the codebase as stubs (`src/infra/drive.ts`) so they can be re-enabled later.
- The background service worker processes pending patches locally (clears them) and notifies the UI of SYNC_STATE changes.
- The legacy adapter `src/infra/drive.legacy.ts` still enqueues patches into IndexedDB; the background worker will "process" them locally and clear the queue (no remote operations).
- You can safely test sample data import, Clients and Invoices pages, and the patch enqueue → background process flow without configuring OAuth.

How to re-enable Google Drive sync (summary)
1. Register an OAuth client in Google Cloud and set `oauth2.client_id` in `manifest.json`.
2. Implement full Drive push/pull logic in `src/infra/drive.ts`:
   - findWorkspaceFile, downloadFile, uploadFile, createWorkspaceFile should be implemented.
   - Use `If-Match` / ETag and retry/backoff logic.
3. Update background worker to call the real pushPatches or upload functions instead of the local-only clearing behavior.
4. Test conflict scenarios (ETag 412) and implement conflict-resolution UI (recommended: prompt before overwriting remote).
5. Remove stubbed behavior and verify end-to-end flows with authenticated user.

Development & test (local)
- npm install
- npm run dev
- For extension testing, build and load `dist` after running:
  - npm run build
  - node ./scripts/emit-manifest.js (build script runs it automatically)

For more details about the scaffold structure and recommended next steps, see the full PR description (if present) or request a plan to implement Drive sync next.
