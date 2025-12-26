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