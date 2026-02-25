import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  style?: React.CSSProperties
}

export default function Card({ children, title, subtitle, style }: CardProps) {
  return (
    <div style={{ ...cardStyle, ...style }}>
      {(title || subtitle) && (
        <div style={cardHeaderStyle}>
          {title && <h3 style={cardTitleStyle}>{title}</h3>}
          {subtitle && <p style={cardSubtitleStyle}>{subtitle}</p>}
        </div>
      )}
      <div style={cardBodyStyle}>
        {children}
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb',
  overflow: 'hidden'
}

const cardHeaderStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb'
}

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937'
}

const cardSubtitleStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '14px',
  color: '#6b7280'
}

const cardBodyStyle: React.CSSProperties = {
  padding: '20px'
}