import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { Menu, X, Bell, User, LogOut, Settings } from 'lucide-react'

interface NavbarProps {
  onPageChange: (page: string) => void
}

export default function Navbar({ onPageChange }: NavbarProps) {
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav style={navbarStyle}>
      <div style={navbarLeftStyle}>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          style={mobileMenuButtonStyle}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div style={logoStyle} onClick={() => onPageChange('dashboard')}>
          <span style={logoIconStyle}>⚙️</span>
          <span style={logoTextStyle}>SteelShop ERP</span>
        </div>
      </div>

      <div style={navbarRightStyle}>
        <button style={iconButtonStyle}>
          <Bell size={20} />
        </button>
        
        <div style={profileContainerStyle}>
          <button 
            style={profileButtonStyle}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div style={avatarStyle}>
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <span style={userNameStyle}>{user?.full_name || user?.username}</span>
          </button>

          {showProfileMenu && (
            <div style={profileMenuStyle}>
              <div style={profileMenuItemStyle}>
                <User size={16} />
                <span>Profile</span>
              </div>
              <div style={profileMenuItemStyle}>
                <Settings size={16} />
                <span>Settings</span>
              </div>
              <div style={profileMenuDividerStyle} />
              <div style={{...profileMenuItemStyle, color: '#dc2626'}} onClick={logout}>
                <LogOut size={16} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const navbarStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  padding: '0 24px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
  fontWeight: '600',
  color: '#1f2937'
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
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb',
  minWidth: '200px',
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