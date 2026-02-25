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
  className,
  ...props 
}: ButtonProps) {
  const base = [`inline-flex`, `items-center`, `justify-center`, `gap-2`, `rounded-lg`, `font-semibold`, `transition`, `duration-150`, `focus:outline-none`, `focus:ring-2`, `focus:ring-offset-2`]

  if (fullWidth) base.push('w-full')

  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  }

  const variantMap: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm focus:ring-green-500',
    outline: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
  }

  const classes = [...base, sizeMap[size], variantMap[variant], className || ''].join(' ')

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !loading && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
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