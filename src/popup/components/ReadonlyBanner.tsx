import React from 'react'

export function ReadonlyBanner(){
  // In a real app, conditionally render based on role/connection
  return <div style={{background:'#ffeeba',padding:8,marginBottom:8}}>Read-only access (offline or insufficient permissions)</div>
}