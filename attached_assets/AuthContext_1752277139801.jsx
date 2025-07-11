import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [organization, setOrganization] = useState(null)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('harmony_token')
        if (token) {
          // Validate token and get user data
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData.user)
            setOrganization(userData.organization)
          } else {
            localStorage.removeItem('harmony_token')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('harmony_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('harmony_token', data.token)
        setUser(data.user)
        setOrganization(data.organization)
        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('harmony_token', data.token)
        setUser(data.user)
        setOrganization(data.organization)
        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('harmony_token')
    setUser(null)
    setOrganization(null)
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const updateOrganization = (orgData) => {
    setOrganization(prev => ({ ...prev, ...orgData }))
  }

  const value = {
    user,
    organization,
    loading,
    login,
    signup,
    logout,
    updateUser,
    updateOrganization
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

