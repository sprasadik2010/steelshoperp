import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { Menu, X, Bell, User, LogOut, Settings } from 'lucide-react'

interface NavbarProps {
  onPageChange: React.Dispatch<React.SetStateAction<any>>
  mobileMenuOpen?: boolean
  setMobileMenuOpen?: (v: boolean) => void
}

export default function Navbar({ onPageChange, mobileMenuOpen = false, setMobileMenuOpen }: NavbarProps) {
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen?.(!mobileMenuOpen)} aria-label="Toggle menu" className="p-2 rounded-md text-gray-600 md:hidden">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div onClick={() => onPageChange('dashboard')} className="flex items-center gap-3 cursor-pointer">
              <div className="text-2xl">⚙️</div>
              <div className="font-bold text-lg text-slate-900">SteelShop ERP</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md text-gray-600 hover:bg-gray-50"><Bell size={18} /></button>

            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">{user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}</div>
                <div className="hidden md:block text-sm font-medium text-slate-900">{user?.full_name || user?.username}</div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md border border-gray-100">
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"><User size={16} /><span>Profile</span></button>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"><Settings size={16} /><span>Settings</span></button>
                  <div className="border-t border-gray-100" />
                  <button onClick={logout} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 flex items-center gap-3"><LogOut size={16} /><span>Logout</span></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const navbarStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  borderBottom: '1px solid rgba(15,23,42,0.04)',
  padding: '0 20px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: 'var(--shadow-sm)'
}

const navbarLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
}

const mobileMenuButtonStyle: React.CSSProperties = {
  display: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '8px',
  color: '#4b5563'
}

// Show mobile menu button on small screens using a CSS class in index.css
mobileMenuButtonStyle.display = 'none'

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer'
}

const logoIconStyle: React.CSSProperties = {
  fontSize: '24px'
}

const logoTextStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#0f172a'
}

const navbarRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
}

const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '8px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#4b5563',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const profileContainerStyle: React.CSSProperties = {
  position: 'relative'
}

const profileButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'none',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '8px',
  cursor: 'pointer'
}

const avatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '14px'
}

const userNameStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#1f2937'
}

const profileMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  backgroundColor: 'var(--surface)',
  borderRadius: '12px',
  boxShadow: 'var(--shadow-md)',
  border: '1px solid rgba(15,23,42,0.04)',
  minWidth: '220px',
  zIndex: 100
}

const profileMenuItemStyle: React.CSSProperties = {
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#374151',
  transition: 'background-color 0.2s'
}

const profileMenuDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#e5e7eb',
  margin: '4px 0'
}

// Add responsive rules via class when loaded (small JS fallback)
if (typeof window !== 'undefined') {
  const applyMobileStyles = () => {
    const w = window.innerWidth
    if (w <= 768) {
      // show the mobile button by adding a class to body so CSS can pick it up
      document.body.classList.add('mobile-xs')
    } else {
      document.body.classList.remove('mobile-xs')
    }
  }
  applyMobileStyles()
  window.addEventListener('resize', applyMobileStyles)
}