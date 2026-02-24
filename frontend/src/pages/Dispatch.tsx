import React, { useState } from 'react'
import { api } from '../api'

export default function DispatchPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [orderId, setOrderId] = useState('')
  const [address, setAddress] = useState('')
  const [msg, setMsg] = useState('')

  const handleDispatch = async () => {
    if (!orderId || !address) {
      setMsg('❌ Please enter Order ID and Delivery Address')
      return
    }
    
    try {
      const res = await api.createShipment(parseInt(orderId), address)
      const shipmentId = res.shipment_id
      
      // Send WhatsApp notification
      await api.sendDeliveryWhatsapp(shipmentId)
      
      const newShipment = {
        id: shipmentId,
        orderId: parseInt(orderId),
        address,
        dispatchedAt: new Date().toLocaleDateString(),
        status: 'Ready for Dispatch',
        whatsappSent: true
      }
      setShipments([...shipments, newShipment])
      setMsg(`✅ Order ${orderId} dispatched! WhatsApp notification sent to dealer.`)
      setOrderId('')
      setAddress('')
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dispatch & Delivery Management</h1>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h2>Dispatch Order</h2>
        <div style={formGroupStyle}>
          <label>Order ID:</label>
          <input type="number" value={orderId} onChange={e => setOrderId(e.target.value)} style={inputStyle} />
        </div>
        <div style={formGroupStyle}>
          <label>Delivery Address:</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} style={inputStyle} />
        </div>
        <button onClick={handleDispatch} style={btnStyle}>Dispatch Order</button>
        {msg && <p style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>{msg}</p>}
      </div>

      {shipments.length === 0 ? (
        <p>No shipments dispatched yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={cellStyle}>Shipment ID</th>
              <th style={cellStyle}>Order ID</th>
              <th style={cellStyle}>Delivery Address</th>
              <th style={cellStyle}>Dispatched</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(ship => (
              <tr key={ship.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={cellStyle}>{ship.id}</td>
                <td style={cellStyle}>{ship.orderId}</td>
                <td style={cellStyle}>{ship.address}</td>
                <td style={cellStyle}>{ship.dispatchedAt}</td>
                <td style={cellStyle}>{ship.status}</td>
                <td style={cellStyle}>{ship.whatsappSent ? '✅ Sent' : '⏳ Pending'}</td>
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

const cellStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
  borderRight: '1px solid #ddd',
}
