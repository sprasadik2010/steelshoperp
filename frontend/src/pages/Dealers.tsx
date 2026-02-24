import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'

interface Dealer {
  id: number
  name: string
  phone?: string
  email?: string
}

export default function DealersPage() {
  const { token } = useAuth()
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/dealers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setDealers)
      .catch(e => setError(String(e)))
  }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:8000/dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, email })
      })
      if (!res.ok) throw new Error(await res.text())
      const d = await res.json()
      setDealers(prev => [d, ...prev])
      setName('')
      setPhone('')
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dealers</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Create Dealer</button>
      </form>

      <ul>
        {dealers.map(d => (
          <li key={d.id}>{d.name} — {d.phone} — {d.email}</li>
        ))}
      </ul>
    </div>
  )
}
