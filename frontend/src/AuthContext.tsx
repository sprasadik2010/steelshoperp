import React, { createContext, useState, useContext, useEffect } from 'react'

interface User {
  id: number
  username: string
  email: string
  full_name?: string
  role: string
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, fullName: string, phone: string, role: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken) {
      setToken(savedToken)
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!response.ok) {
        // Try to surface server error message
        let text = 'Login failed'
        try { const j = await response.json(); if (j?.detail) text = String(j.detail) } catch { /* ignore */ }
        throw new Error(text)
      }
      const data = await response.json()
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    } catch (err: any) {
      if (err instanceof TypeError && /failed to fetch/i.test(String(err.message))) {
        throw new Error('Unable to reach backend. Is the server running on http://localhost:8000 ?')
      }
      throw err
    }
  }

  const register = async (username: string, email: string, password: string, fullName: string, phone: string, role: string) => {
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, full_name: fullName, phone, role })
      })
      if (!response.ok) {
        let text = 'Registration failed'
        try { const j = await response.json(); if (j?.detail) text = String(j.detail) } catch { }
        throw new Error(text)
      }
      const data = await response.json()
      setToken(data.access_token)
      setUser(data.user)
      localStorage.setItem('auth_token', data.access_token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
    } catch (err: any) {
      if (err instanceof TypeError && /failed to fetch/i.test(String(err.message))) {
        throw new Error('Unable to reach backend. Is the server running on http://localhost:8000 ?')
      }
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
