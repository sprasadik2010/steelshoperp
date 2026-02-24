import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variantStyles = {
    success: { backgroundColor: '#dcfce7', color: '#166534' },
    warning: { backgroundColor: '#fef3c7', color: '#92400e' },
    danger: { backgroundColor: '#fee2e2', color: '#991b1b' },
    info: { backgroundColor: '#dbeafe', color: '#1e40af' },
    default: { backgroundColor: '#f3f4f6', color: '#1f2937' }
  }

  return (
    <span style={{
      ...badgeStyle,
      ...variantStyles[variant]
    }}>
      {children}
    </span>
  )
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '500',
  lineHeight: 1
}