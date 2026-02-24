import React from 'react'
import { useAuth } from '../AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user } = useAuth()

  return (
    <div style={layoutStyle}>
      <Navbar onPageChange={onPageChange} />
      <div style={mainContainerStyle}>
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} userRole={user?.role} />
        <main style={contentStyle}>
          {children}
        </main>
      </div>
    </div>
  )
}

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f3f4f6',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
}

const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden'
}

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: '24px',
  overflowY: 'auto',
  backgroundColor: '#f3f4f6'
}