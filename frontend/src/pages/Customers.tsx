import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'

interface Customer {
  id: number
  name: string
  phone?: string
  email?: string
}

export default function CustomersPage() {
  const { token } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/customers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setCustomers)
      .catch(e => setError(String(e)))
  }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:8000/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, email })
      })
      if (!res.ok) throw new Error(await res.text())
      const d = await res.json()
      setCustomers(prev => [d, ...prev])
      setName('')
      setPhone('')
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Customers</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Create Customer</button>
      </form>

      <ul>
        {customers.map(d => (
          <li key={d.id}>{d.name} — {d.phone} — {d.email}</li>
        ))}
      </ul>
    </div>
  )
}
