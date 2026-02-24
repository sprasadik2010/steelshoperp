import React, { useState } from 'react'
import { api } from '../api'

export default function QCPage() {
  const [products, setProducts] = useState<any[]>([])
  const [newProduct, setNewProduct] = useState('')
  const [msg, setMsg] = useState('')

  const addProduct = () => {
    if (newProduct) {
      setProducts([...products, { id: Date.now(), name: newProduct, status: 'Pending QC', qcResult: null, notes: '' }])
      setNewProduct('')
    }
  }

  const handleQCResult = async (id: number, result: 'pass' | 'fail', notes: string) => {
    try {
      const product = products.find(p => p.id === id)
      await api.qcResult(id, result, notes)
      
      let nextStatus = ''
      if (result === 'pass') {
        nextStatus = 'Passed QC → Accessories'
      } else {
        nextStatus = 'Failed QC → Back to Fabrication'
      }
      
      setProducts(products.map(p => 
        p.id === id ? { ...p, qcResult: result, notes, status: nextStatus } : p
      ))
      setMsg(`✅ QC ${result.toUpperCase()} recorded for product ${id}`)
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quality Check (QC) Department</h1>
      <p style={{ color: '#666' }}>Pass: Forward to Accessories Fitting | Fail: Send back to Fabrication</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newProduct}
          onChange={e => setNewProduct(e.target.value)}
          placeholder="Product name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={addProduct} style={btnStyle}>Add Product</button>
      </div>

      {msg && <p style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '20px' }}>{msg}</p>}

      {products.length === 0 ? (
        <p>No products in QC yet.</p>
      ) : (
        <div>
          {products.map(p => (
            <div key={p.id} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
              <h4>Product: {p.name} (ID: {p.id})</h4>
              <p><strong>Status:</strong> {p.status}</p>
              
              {!p.qcResult ? (
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <textarea
                      placeholder="QC Notes/Observations"
                      defaultValue={p.notes}
                      onChange={e => {
                        const notes = e.target.value
                        setProducts(products.map(prod => prod.id === p.id ? { ...prod, notes } : prod))
                      }}
                      rows={3}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    onClick={() => handleQCResult(p.id, 'pass', p.notes)}
                    style={{ ...btnSmallStyle, background: '#28a745', marginRight: '10px' }}
                  >
                    ✓ PASS
                  </button>
                  <button
                    onClick={() => handleQCResult(p.id, 'fail', p.notes)}
                    style={{ ...btnSmallStyle, background: '#dc3545', marginRight: '10px' }}
                  >
                    ✗ FAIL
                  </button>
                </div>
              ) : (
                <div style={{ padding: '10px', background: p.qcResult === 'pass' ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
                  <p><strong>Result:</strong> {p.qcResult.toUpperCase()} {p.qcResult === 'pass' ? '✅' : '❌'}</p>
                  <p><strong>Notes:</strong> {p.notes || 'None'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

const btnSmallStyle: React.CSSProperties = {
  padding: '8px 16px',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
}
