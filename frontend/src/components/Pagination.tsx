import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div style={paginationStyle}>
      <button
        style={{
          ...pageButtonStyle,
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </button>
      
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          style={{
            ...pageButtonStyle,
            ...(currentPage === i + 1 ? activePageButtonStyle : {})
          }}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      
      <button
        style={{
          ...pageButtonStyle,
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '20px'
}

const pageButtonStyle: React.CSSProperties = {
  minWidth: '36px',
  height: '36px',
  padding: '0 8px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  background: '#ffffff',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const activePageButtonStyle: React.CSSProperties = {
  background: '#2563eb',
  color: '#ffffff',
  borderColor: '#2563eb'
}