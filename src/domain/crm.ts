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