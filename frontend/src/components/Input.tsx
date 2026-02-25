import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export default function Input({ label, error, icon, style, className, ...props }: InputProps) {
  return (
    <div className={`w-full ${className || ''}`}>
      {label && <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? 'pl-12' : ''} ${error ? 'border-red-500' : ''}`}
          style={style}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-red-600 mt-2 block">{error}</span>}
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  marginBottom: '16px'
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--muted)'
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
  padding: '12px 14px',
  fontSize: '14px',
  border: '1px solid rgba(15,23,42,0.06)',
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.16s ease, box-shadow 0.16s ease',
  boxSizing: 'border-box',
  background: 'var(--surface)'
}

const inputErrorStyle: React.CSSProperties = {
  borderColor: 'var(--danger)'
}

const errorMessageStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '6px',
  fontSize: '12px',
  color: 'var(--danger)'
}