import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  currentPage: any
  onPageChange: React.Dispatch<React.SetStateAction<any>>
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar onPageChange={onPageChange} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} userRole={user?.role} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 py-6">
          <div className="card-lg bg-white shadow-sm p-6">{children}</div>
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