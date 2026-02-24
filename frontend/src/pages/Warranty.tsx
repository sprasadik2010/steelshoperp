import React, { useState } from 'react'

export default function WarrantyPage() {
  const [warranties, setWarranties] = useState<any[]>([])
  const [orderId, setOrderId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [details, setDetails] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !customerId) {
      setMsg('❌ Please enter Order ID and Customer ID')
      return
    }
    const warranty = {
      id: Date.now(),
      orderId: parseInt(orderId),
      customerId: parseInt(customerId),
      details: details || 'Standard warranty',
      submittedAt: new Date().toLocaleDateString(),
      status: 'Pending Approval'
    }
    setWarranties([...warranties, warranty])
    setMsg(`✅ Warranty submitted for Order ${orderId}. Awaiting dealer approval.`)
    setOrderId('')
    setCustomerId('')
    setDetails('')
  }

  const approveWarranty = (id: number) => {
    setWarranties(warranties.map(w => w.id === id ? { ...w, status: 'Approved - Cert Generated' } : w))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Warranty Management</h1>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h2>Submit Warranty Form</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label>Order ID:</label>
            <input type="number" value={orderId} onChange={e => setOrderId(e.target.value)} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label>Customer ID:</label>
            <input type="number" value={customerId} onChange={e => setCustomerId(e.target.value)} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label>Warranty Details:</label>
            <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} style={inputStyle} placeholder="Enter warranty terms & conditions" />
          </div>
          <button type="submit" style={btnStyle}>Submit Warranty</button>
          {msg && <p style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>{msg}</p>}
        </form>
      </div>

      {warranties.length === 0 ? (
        <p>No warranties submitted yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={cellStyle}>Warranty ID</th>
              <th style={cellStyle}>Order ID</th>
              <th style={cellStyle}>Customer ID</th>
              <th style={cellStyle}>Details</th>
              <th style={cellStyle}>Submitted</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {warranties.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={cellStyle}>{w.id}</td>
                <td style={cellStyle}>{w.orderId}</td>
                <td style={cellStyle}>{w.customerId}</td>
                <td style={cellStyle}>{w.details}</td>
                <td style={cellStyle}>{w.submittedAt}</td>
                <td style={cellStyle}>{w.status}</td>
                <td style={cellStyle}>
                  {w.status === 'Pending Approval' && (
                    <button onClick={() => approveWarranty(w.id)} style={btnSmallStyle}>Approve</button>
                  )}
                  {w.status === 'Approved - Cert Generated' && (
                    <span style={{ color: 'green' }}>✅ Certificate Generated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const formGroupStyle: React.CSSProperties = {
  marginBottom: '15px'
}

const inputStyle: React.CSSProperties = {
  padding: '8px',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: '5px',
  fontFamily: 'inherit'
}

const btnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

const btnSmallStyle: React.CSSProperties = {
  padding: '5px 10px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
}

const cellStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
  borderRight: '1px solid #ddd',
}
