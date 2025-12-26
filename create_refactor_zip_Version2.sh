#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="crm-refactor-files"
ZIP_NAME="${OUT_DIR}.zip"

if [ -d "$OUT_DIR" ]; then
  echo "Removing existing $OUT_DIR ..."
  rm -rf "$OUT_DIR"
fi

mkdir -p "$OUT_DIR"
mkdir -p "$OUT_DIR/src/domain/models"
mkdir -p "$OUT_DIR/src/storage"
mkdir -p "$OUT_DIR/src/state"
mkdir -p "$OUT_DIR/tests/domain"
mkdir -p "$OUT_DIR/.github/workflows"

echo "Creating files in $OUT_DIR ..."

cat > "$OUT_DIR/manifest.json" <<'JSON'
{
  "manifest_version": 3,
  "name": "Employee & Client Management CRM",
  "version": "1.1.0",
  "description": "Client-centric CRM workspace (draggable popup) with Google Drive AppData sync.",
  "permissions": [
    "storage",
    "identity"
  ],
  "oauth2": {
    "client_id": "REPLACE_WITH_GOOGLE_OAUTH_CLIENT_ID",
    "scopes": [
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  },
  "action": {
    "default_popup": "popup/index.html",
    "default_title": "Employee CRM"
  },
  "background": {
    "service_worker": "background/index.js",
    "type": "module"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "host_permissions": [
    "https://www.googleapis.com/*"
  ],
  "web_accessible_resources": [
    {
      "resources": ["assets/*", "popup/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
JSON

cat > "$OUT_DIR/package.json" <<'JSON'
{
  "name": "employee-crm-extension",
  "version": "1.0.0",
  "private": true,
  "description": "Chrome Extension CRM — Vite + React + TypeScript + Drive AppData sync",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node ./scripts/emit-manifest.js",
    "preview": "vite preview --port 5174",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-rnd": "^11.1.7",
    "idb": "^7.0.1",
    "axios": "^1.4.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "typescript": "^5.4.2",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@types/chrome": "^0.0.182",
    "vitest": "^1.0.0"
  }
}
JSON

cat > "$OUT_DIR/src/domain/models/Employee.ts" <<'TS'
export interface Employee {
  id: string
  name: string
  role: string
  email: string
}
TS

cat > "$OUT_DIR/src/domain/crm.ts" <<'TS'
import { Employee } from './models/Employee'

export function addEmployee(list: Employee[], emp: Employee): Employee[] {
  return [...list, emp]
}

export function removeEmployee(list: Employee[], id: string): Employee[] {
  return list.filter(e => e.id !== id)
}

export function updateEmployee(list: Employee[], updated: Employee): Employee[] {
  return list.map(e => (e.id === updated.id ? updated : e))
}
TS

cat > "$OUT_DIR/src/storage/crmRepository.ts" <<'TS'
import { Employee } from '../domain/models/Employee'

const KEY = 'crm_employees'

export async function loadEmployees(): Promise<Employee[]> {
  // chrome.storage.local.get returns an object with the requested keys
  // In tests you should mock chrome.storage
  const res = await chrome.storage.local.get(KEY)
  return res[KEY] ?? []
}

export async function saveEmployees(data: Employee[]) {
  await chrome.storage.local.set({ [KEY]: data })
}
TS

cat > "$OUT_DIR/src/state/crmStore.ts" <<'TS'
import { create } from 'zustand'
import { Employee } from '../domain/models/Employee'
import * as repo from '../storage/crmRepository'

interface CRMState {
  employees: Employee[]
  load(): Promise<void>
  add(e: Employee): Promise<void>
  remove(id: string): Promise<void>
}

export const useCRMStore = create<CRMState>((set, get) => ({
  employees: [],

  async load() {
    const data = await repo.loadEmployees()
    set({ employees: data })
  },

  async add(e) {
    const updated = [...get().employees, e]
    await repo.saveEmployees(updated)
    set({ employees: updated })
  },

  async remove(id) {
    const updated = get().employees.filter(emp => emp.id !== id)
    await repo.saveEmployees(updated)
    set({ employees: updated })
  }
}))
TS

cat > "$OUT_DIR/tests/domain/crm.test.ts" <<'TS'
import { describe, it, expect } from 'vitest'
import { addEmployee, removeEmployee, updateEmployee } from '../../src/domain/crm'

describe('domain/crm', () => {
  it('adds employee', () => {
    const res = addEmployee([], { id: '1', name: 'A', role: 'Dev', email: 'a@x.com' })
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('1')
  })

  it('removes employee', () => {
    const list = [{ id: '1', name: 'A', role: 'Dev', email: 'a@x.com' }]
    const res = removeEmployee(list, '1')
    expect(res).toHaveLength(0)
  })

  it('updates employee', () => {
    const list = [{ id: '1', name: 'A', role: 'Dev', email: 'a@x.com' }]
    const res = updateEmployee(list, { id: '1', name: 'A2', role: 'Dev', email: 'a2@x.com' })
    expect(res[0].name).toBe('A2')
    expect(res[0].email).toBe('a2@x.com')
  })
})
TS

cat > "$OUT_DIR/.github/workflows/ci.yml" <<'YML'
name: CI

on:
  push:
    branches:
      - main
      - feat/refactor-architecture
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install
        run: npm ci
      - name: Run tests
        run: npm test --if-present
YML

echo "Creating zip: $ZIP_NAME ..."
if command -v zip >/dev/null 2>&1; then
  (cd "$OUT_DIR" && zip -r "../$ZIP_NAME" . >/dev/null)
else
  # Try using python zip if zip isn't available
  python3 - <<PY
import os, zipfile
zipf = zipfile.ZipFile("$ZIP_NAME", "w", zipfile.ZIP_DEFLATED)
for root, dirs, files in os.walk("$OUT_DIR"):
    for f in files:
        full = os.path.join(root, f)
        arcname = os.path.relpath(full, "$OUT_DIR")
        zipf.write(full, arcname)
zipf.close()
PY
fi

echo "Created $ZIP_NAME with these files:"
unzip -l "$ZIP_NAME" | sed -n '4,200p'
echo ""
echo "Done. Extract the zip into your repo root or inspect crm-refactor-files/ for files."