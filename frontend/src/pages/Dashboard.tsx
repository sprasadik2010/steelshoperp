import React from 'react'
import { useAuth } from '../AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0, marginBottom: 8 }}>Welcome{user ? `, ${user.full_name || user.username}` : ''}</h2>
      <p style={{ color: '#6b7280' }}>This is the dashboard. Select a page from the sidebar to begin.</p>
    </div>
  )
}