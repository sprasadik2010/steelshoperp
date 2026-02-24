import React from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
}

export default function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead style={tableHeadStyle}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={tableHeaderStyle}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={emptyStateStyle}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                style={tableRowStyle}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} style={tableCellStyle}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
  borderRadius: '8px',
  border: '1px solid #e5e7eb'
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#ffffff',
  fontSize: '14px'
}

const tableHeadStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderBottom: '1px solid #e5e7eb'
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151'
}

const tableRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #e5e7eb',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
}

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  color: '#4b5563'
}

const emptyStateStyle: React.CSSProperties = {
  padding: '48px 16px',
  textAlign: 'center',
  color: '#6b7280'
}