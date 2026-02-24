import React, { useState } from 'react'
import { Plus, Download, FileText, DollarSign } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Alert from '../components/Alert'
import Modal from '../components/Modal'

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([
    { id: 1, orderId: 1001, amount: 25000, createdAt: '2024-01-15', status: 'Paid' },
    { id: 2, orderId: 1002, amount: 18750, createdAt: '2024-01-16', status: 'Pending' },
    { id: 3, orderId: 1003, amount: 32000, createdAt: '2024-01-16', status: 'Generated' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState({ type: 'success', message: '' })

  const columns = [
    { key: 'id', label: 'Invoice ID' },
    { key: 'orderId', label: 'Order ID' },
    { key: 'amount', label: 'Amount', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'createdAt', label: 'Created' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => {
        const variant = value === 'Paid' ? 'success' : value === 'Pending' ? 'warning' : 'info'
        return <Badge variant={variant}>{value}</Badge>
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="outline" icon={<Download size={14} />}>
            PDF
          </Button>
          {row.status !== 'Paid' && (
            <Button size="sm" variant="success" icon={<DollarSign size={14} />}>
              Pay
            </Button>
          )}
        </div>
      )
    }
  ]

  const handleCreateInvoice = () => {
    if (!orderId || !amount) {
      setMsg({ type: 'error', message: 'Please enter Order ID and Amount' })
      return
    }
    
    const newInvoice = {
      id: Date.now(),
      orderId: parseInt(orderId),
      amount: parseFloat(amount),
      createdAt: new Date().toLocaleDateString('en-CA'),
      status: 'Generated'
    }
    
    setInvoices([newInvoice, ...invoices])
    setMsg({ type: 'success', message: `✅ Invoice generated for Order ${orderId}` })
    setOrderId('')
    setAmount('')
    setShowModal(false)
  }

  return (
    <div>
      <div style={headerStyle}>
        <div>
          <h1 style={pageTitleStyle}>Billing & Invoice Management</h1>
          <p style={pageSubtitleStyle}>Manage invoices, track payments, and generate bills</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setShowModal(true)}
        >
          Create Invoice
        </Button>
      </div>

      {msg.message && (
        <Alert 
          type={msg.type as any} 
          message={msg.message} 
          onClose={() => setMsg({ type: 'success', message: '' })}
        />
      )}

      <Card>
        <div style={statsRowStyle}>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>Total Invoices</span>
            <span style={statValueStyle}>₹{(1250000).toLocaleString()}</span>
          </div>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>Paid</span>
            <span style={{...statValueStyle, color: '#16a34a'}}>₹{(875000).toLocaleString()}</span>
          </div>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>Pending</span>
            <span style={{...statValueStyle, color: '#dc2626'}}>₹{(375000).toLocaleString()}</span>
          </div>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>This Month</span>
            <span style={statValueStyle}>₹{(187500).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Card title="Recent Invoices" style={{ marginTop: '20px' }}>
        <Table 
          columns={columns} 
          data={invoices}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Invoice"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateInvoice}>
              Generate Invoice
            </Button>
          </>
        }
      >
        <Input
          label="Order ID"
          type="number"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="Enter order ID"
          icon={<FileText size={18} />}
        />
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
          icon={<DollarSign size={18} />}
        />
      </Modal>
    </div>
  )
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
}

const pageTitleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 8px'
}

const pageSubtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  margin: 0
}

const statsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '20px'
}

const statItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
}

const statLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}

const statValueStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1f2937'
}