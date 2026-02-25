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
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
        <thead className="bg-white">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick?.(row)}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-700">
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
  borderRadius: '8px'
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'var(--surface)',
  fontSize: '14px'
}

const tableHeadStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  borderBottom: '1px solid rgba(15,23,42,0.04)'
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151'
}

const tableRowStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(15,23,42,0.04)',
  cursor: 'pointer',
  transition: 'background 0.12s, transform 0.12s'
}

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  color: 'var(--muted)'
}

const emptyStateStyle: React.CSSProperties = {
  padding: '48px 16px',
  textAlign: 'center',
  color: 'var(--muted)'
}