import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export default function Input({ label, error, icon, style, ...props }: InputProps) {
  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && <span style={iconWrapperStyle}>{icon}</span>}
        <input
          style={{
            ...inputStyle,
            ...(icon ? { paddingLeft: '40px' } : {}),
            ...(error ? inputErrorStyle : {}),
            ...style
          }}
          {...props}
        />
      </div>
      {error && <span style={errorMessageStyle}>{error}</span>}
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  marginBottom: '16px'
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151'
}

const inputWrapperStyle: React.CSSProperties = {
  position: 'relative'
}

const iconWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#9ca3af',
  display: 'flex',
  alignItems: 'center'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box'
}

const inputErrorStyle: React.CSSProperties = {
  borderColor: '#dc2626'
}

const errorMessageStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '4px',
  fontSize: '12px',
  color: '#dc2626'
}