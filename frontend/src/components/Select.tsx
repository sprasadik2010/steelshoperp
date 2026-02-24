import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export default function Select({ label, error, options, style, ...props }: SelectProps) {
  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <select
        style={{
          ...selectStyle,
          ...(error ? selectErrorStyle : {}),
          ...style
        }}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  backgroundColor: '#ffffff',
  color: '#1f2937',
  cursor: 'pointer'
}

const selectErrorStyle: React.CSSProperties = {
  borderColor: '#dc2626'
}

const errorMessageStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '4px',
  fontSize: '12px',
  color: '#dc2626'
}