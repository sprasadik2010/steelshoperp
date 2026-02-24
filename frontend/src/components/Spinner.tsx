import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function Spinner({ size = 'md', color = '#2563eb' }: SpinnerProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32
  }

  return (
    <div style={spinnerContainerStyle}>
      <div style={{
        ...spinnerStyle,
        width: sizes[size],
        height: sizes[size],
        borderColor: `${color}20`,
        borderTopColor: color
      }} />
    </div>
  )
}

const spinnerContainerStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const spinnerStyle: React.CSSProperties = {
  border: '2px solid',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite'
}