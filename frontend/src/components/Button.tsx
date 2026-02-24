import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  loading,
  fullWidth,
  disabled,
  style,
  ...props 
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto'
  }

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' }
  }

  const variantStyles = {
    primary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      ':hover': { backgroundColor: '#1d4ed8' }
    },
    secondary: {
      backgroundColor: '#6b7280',
      color: '#ffffff',
      ':hover': { backgroundColor: '#4b5563' }
    },
    danger: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      ':hover': { backgroundColor: '#b91c1c' }
    },
    success: {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      ':hover': { backgroundColor: '#15803d' }
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid #d1d5db',
      color: '#374151',
      ':hover': { backgroundColor: '#f3f4f6' }
    }
  }

  return (
    <button
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span style={spinnerStyle} />}
      {icon && !loading && <span style={iconStyle}>{icon}</span>}
      {children}
    </button>
  )
}

const spinnerStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: '#ffffff',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite'
}

const iconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}