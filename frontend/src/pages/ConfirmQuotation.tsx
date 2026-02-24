import React, { useState } from 'react'
import { api } from '../api'

export default function ConfirmQuotationPage() {
  const [token, setToken] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.confirmByToken(token)
      setMsg(`✅ Quotation ${res.quotation_id} confirmed! A notification has been sent to the dealer.`)
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Confirm Your Quotation</h1>
      <form onSubmit={handleConfirm} style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Confirmation Token:
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste your confirmation token here"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Confirming...' : 'Confirm Quotation'}
        </button>
      </form>
      {msg && <p style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>{msg}</p>}
    </div>
  )
}
