import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { LogIn, UserPlus, Mail, Lock, User, Phone } from 'lucide-react'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('dealer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password, fullName, phone, role)
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <Card>
        <div style={headerStyle}>
          <div style={logoWrapperStyle}>
            <span style={logoStyle}>⚙️</span>
          </div>
          <h1 style={titleStyle}>SteelShop ERP</h1>
          <p style={subtitleStyle}>Manufacturing Management System</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
                icon={<User size={18} />}
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<Mail size={18} />}
                required
              />

              <Input
                label="Phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                icon={<Phone size={18} />}
              />
            </>
          )}

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            icon={<User size={18} />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            required
          />

          {!isLogin && (
            <div style={formGroupStyle}>
              <label style={selectLabelStyle}>Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={selectStyle}
              >
                <option value="dealer">Dealer</option>
                <option value="customer">Customer</option>
                <option value="order_taker">Order Taker</option>
                <option value="dept_head">Department Head</option>
              </select>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          <div style={toggleContainerStyle}>
            <span style={toggleTextStyle}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={toggleButtonStyle}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px'
}

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '30px'
}

const logoWrapperStyle: React.CSSProperties = {
  marginBottom: '16px'
}

const logoStyle: React.CSSProperties = {
  fontSize: '48px'
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '24px',
  fontWeight: '600',
  color: '#1f2937'
}

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: '#6b7280'
}

const errorStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  borderRadius: '8px',
  marginBottom: '20px',
  fontSize: '14px',
  border: '1px solid #fecaca'
}

const formGroupStyle: React.CSSProperties = {
  marginBottom: '16px'
}

const selectLabelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151'
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  backgroundColor: '#ffffff',
  color: '#1f2937'
}

const toggleContainerStyle: React.CSSProperties = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '14px'
}

const toggleTextStyle: React.CSSProperties = {
  color: '#6b7280',
  marginRight: '5px'
}

const toggleButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '14px',
  textDecoration: 'underline'
}