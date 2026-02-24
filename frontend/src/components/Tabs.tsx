import React, { useState } from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  children?: React.ReactNode
}

export default function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div>
      <div style={tabsContainerStyle}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...tabStyle,
              ...(activeTab === tab.id ? activeTabStyle : {})
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span style={tabIconStyle}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}

const tabsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: '20px'
}

const tabStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: 'none',
  border: 'none',
  borderBottom: '2px solid transparent',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s'
}

const activeTabStyle: React.CSSProperties = {
  color: '#2563eb',
  borderBottomColor: '#2563eb'
}

const tabIconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center'
}