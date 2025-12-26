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