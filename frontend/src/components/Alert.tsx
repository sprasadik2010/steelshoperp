import React from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export default function Alert({ type = 'info', message, onClose }: AlertProps) {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />
  }

  const styles = {
    success: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' },
    error: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
    warning: { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
    info: { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' }
  }

  return (
    <div style={{
      ...alertStyle,
      ...styles[type]
    }}>
      <div style={alertContentStyle}>
        {icons[type]}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} style={closeButtonStyle}>×</button>
      )}
    </div>
  )
}

const alertStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '8px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid'
}

const alertContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px'
}

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: 'inherit',
  padding: '0 4px'
}