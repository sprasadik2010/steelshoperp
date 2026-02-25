import React, { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'

interface SidebarProps {
  currentPage: any
  onPageChange: React.Dispatch<React.SetStateAction<any>>
  userRole?: string
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  id: string
  label: string
  icon: keyof typeof Icons
  roles: string[]
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['*'] },
  { id: 'confirm', label: 'Confirm Quotation', icon: 'CheckCircle', roles: ['*'] },
  { id: 'verify-order', label: 'Verify Order', icon: 'ClipboardCheck', roles: ['order_taker'] },
  
  // Dealer items
  { id: 'drawing', label: 'Drawing', icon: 'Ruler', roles: ['dealer', 'dept_head'] },
  { id: 'dealers', label: 'Dealers', icon: 'Building2', roles: ['dealer'] },
  { id: 'customers', label: 'Customers', icon: 'Users', roles: ['dealer'] },
  
  // Department head items
  { id: 'cutting', label: 'Cutting', icon: 'Scissors', roles: ['dept_head'] },
  { id: 'bending', label: 'Bending', icon: 'MoveDiagonal', roles: ['dept_head'] },
  { id: 'fabrication', label: 'Fabrication', icon: 'Wrench', roles: ['dept_head'] },
  { id: 'qc-decision', label: 'QC', icon: 'ClipboardCheck', roles: ['dept_head'] },
  { id: 'accessories', label: 'Accessories', icon: 'Package', roles: ['dept_head'] },
  { id: 'painting', label: 'Painting', icon: 'Brush', roles: ['dept_head'] },
  { id: 'finalqc-decision', label: 'Final QC', icon: 'Award', roles: ['dept_head'] },
  { id: 'wrapping', label: 'Wrapping', icon: 'Package', roles: ['dept_head'] },
  
  // Dealer financial items
  { id: 'billing', label: 'Billing', icon: 'CreditCard', roles: ['dealer'] },
  { id: 'dispatch', label: 'Dispatch', icon: 'Truck', roles: ['dealer'] },
  { id: 'warranty', label: 'Warranty', icon: 'Shield', roles: ['dealer'] }
]

export default function Sidebar({ currentPage, onPageChange, userRole, isOpen = true, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const filteredItems = navItems.filter(item => 
    !userRole ? item.roles.includes('*') : 
    item.roles.includes('*') || item.roles.includes(userRole)
  )

  const renderIcon = (iconName: keyof typeof Icons) => {
    try {
      // Lucide React icons can be accessed in different ways
      const Icon = Icons[iconName] as React.ComponentType<{ size?: number }>
      return <Icon size={18} />
    } catch (error) {
      console.error(`Error rendering icon "${iconName}":`, error)
      return null
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, pageId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPageChange(pageId)
    }
  }

  if (filteredItems.length === 0) {
    return (
      <aside style={sidebarStyle} role="navigation" aria-label="Main navigation">
        <div style={sidebarContentStyle}>
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
            No navigation items available
          </p>
        </div>
      </aside>
    )
  }

  const combinedStyle: React.CSSProperties = {
    ...sidebarStyle,
    ...(isMobile ? {
      position: 'fixed',
      top: '64px',
      left: 0,
      bottom: 0,
      width: '80%',
      maxWidth: '320px',
      zIndex: 70,
      transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
      transition: 'transform 0.25s ease-in-out',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
    } : {})
  }
  const mobileOverlayClass = isOpen ? 'translate-x-0' : '-translate-x-full'

  return (
    <aside
      className={`bg-white border-r border-gray-100 h-[calc(100vh-64px)] overflow-y-auto ${isMobile ? `fixed z-40 top-16 left-0 bottom-0 w-3/4 max-w-xs transform transition-transform ${mobileOverlayClass}` : 'w-64 sticky top-16'}`}
      role="navigation"
      aria-label="Main navigation"
      aria-hidden={!isOpen && isMobile}
    >
      <div className={`px-3 py-2 ${isMobile ? 'flex justify-end' : ''}`}>
        {isMobile && (
          <button onClick={onClose} className="p-2 rounded-md text-gray-600">✕</button>
        )}
      </div>

      <nav className="px-3 py-2">
        {filteredItems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => { onPageChange(item.id); if (isMobile) onClose?.() }}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-current={isActive ? 'page' : undefined}
              role="tab"
              tabIndex={0}
              className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="w-5 flex items-center justify-center text-gray-500">{renderIcon(item.icon)}</span>
              <span className="flex-1">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

// Styles
const sidebarStyle: React.CSSProperties = {
  width: '260px',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e5e7eb',
  height: 'calc(100vh - 64px)',
  position: 'sticky',
  top: '64px',
  overflowY: 'auto',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
}

const sidebarHiddenStyle: React.CSSProperties = {
  transform: 'translateX(-110%)',
  position: 'fixed',
  zIndex: 60,
  transition: 'transform 0.25s ease-in-out'
}

const sidebarHeaderStyle: React.CSSProperties = {
  display: 'none',
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb'
}

const mobileSidebarCloseStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer'
}

const sidebarContentStyle: React.CSSProperties = {
  padding: '16px'
}

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '10px 12px',
  border: 'none',
  background: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#4b5563',
  fontSize: '14px',
  fontWeight: '500',
  textAlign: 'left',
  marginBottom: '4px',
  position: 'relative',
  transition: 'all 0.2s ease',
  outline: 'none'
}

const activeNavItemStyle: React.CSSProperties = {
  backgroundColor: '#eff6ff',
  color: '#2563eb',
  fontWeight: '600'
}

const navIconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px'
}

const navLabelStyle: React.CSSProperties = {
  flex: 1
}

const activeIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: '8px',
  bottom: '8px',
  width: '3px',
  backgroundColor: '#2563eb',
  borderRadius: '0 4px 4px 0'
}