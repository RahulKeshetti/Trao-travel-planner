import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = api.getToken()
    if (!token) {
      setLoading(false)
      return
    }
    api
      .fetchCurrentUser()
      .then((res) => setUser(res.user))
      .catch(() => api.clearToken())
      .finally(() => setLoading(false))
  }, [])

  async function login(credentials) {
    const res = await api.loginUser(credentials)
    api.setToken(res.token)
    setUser(res.user)
    return res.user
  }

  async function register(payload) {
    const res = await api.registerUser(payload)
    api.setToken(res.token)
    setUser(res.user)
    return res.user
  }

  function logout() {
    api.clearToken()
    setUser(null)
  }

  const value = { user, loading, isAuthenticated: !!user, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
