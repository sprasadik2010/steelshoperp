import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        style={{
          ...textareaStyle,
          ...(error ? textareaErrorStyle : {}),
          ...style
        }}
        {...props}
      />
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

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  resize: 'vertical',
  minHeight: '80px',
  fontFamily: 'inherit'
}

const textareaErrorStyle: React.CSSProperties = {
  borderColor: '#dc2626'
}

const errorMessageStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '4px',
  fontSize: '12px',
  color: '#dc2626'
}