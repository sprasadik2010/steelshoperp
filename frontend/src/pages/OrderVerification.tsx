import React, { useState } from 'react'
import { api } from '../api'

export default function OrderVerificationPage() {
  const [orderId, setOrderId] = useState('')
  const [orderTaker, setOrderTaker] = useState('admin')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.verifyOrder(parseInt(orderId), orderTaker)
      setMsg(`✅ Order ${orderId} verified successfully. Technical details confirmed. Price hidden from display.`)
      setOrderId('')
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Order Verification (Order Taker)</h1>
      <p style={{ color: '#666', fontStyle: 'italic' }}>
        Verify technical details ({'{'}Price hidden from this view{'}'}). Once verified, order moves to Work Order creation.
      </p>

      <form onSubmit={handleVerify} style={{ marginTop: '20px' }}>
        <div style={formGroupStyle}>
          <label>Order ID:</label>
          <input
            type="number"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="Enter order ID"
            style={inputStyle}
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label>Order Taker Name:</label>
          <input
            type="text"
            value={orderTaker}
            onChange={e => setOrderTaker(e.target.value)}
            placeholder="Your name/ID"
            style={inputStyle}
          />
        </div>

        <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '4px', marginBottom: '15px' }}>
          <h3>Checklist (verify items below):</h3>
          <ul>
            <li>✓ Product dimensions are correct</li>
            <li>✓ Material type specified</li>
            <li>✓ Finish/coating requirements noted</li>
            <li>✓ Delivery timeline feasible</li>
            <li>✓ Special instructions documented</li>
          </ul>
          <p style={{ fontSize: '12px', color: '#888' }}>Note: Final price will be calculated and locked in Work Order stage.</p>
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Verifying...' : 'Verify Order'}
        </button>
      </form>

      {msg && <p style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>{msg}</p>}
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
  marginTop: '5px'
}
