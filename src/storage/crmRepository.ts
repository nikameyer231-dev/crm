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