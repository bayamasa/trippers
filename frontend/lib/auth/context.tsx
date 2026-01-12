'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { apiClient } from '@/lib/api/client'

interface UserProfile {
  lastName: string
  firstName: string
  gender: string
  dateOfBirth: string
  location: string
}

interface User {
  id: number
  email: string
  emailVerified: boolean
  profileCompleted: boolean
  profile: UserProfile | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const data = await apiClient<User>('/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(data)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string): Promise<void> => {
    const data = await apiClient<{
      user: { id: number; email: string; emailVerified: boolean }
      token: string
    }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('token', data.token)
    await refreshUser()
  }

  const signup = async (email: string, password: string) => {
    await apiClient('/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
