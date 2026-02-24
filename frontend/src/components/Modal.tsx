import React from 'react'
import { X } from 'lucide-react'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>{title}</h3>
          <button style={modalCloseStyle} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div style={modalBodyStyle}>
          {children}
        </div>
        
        {footer && (
          <div style={modalFooterStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
}

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'hidden'
}

const modalHeaderStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

const modalTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937'
}

const modalCloseStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const modalBodyStyle: React.CSSProperties = {
  padding: '20px',
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 120px)'
}

const modalFooterStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
}