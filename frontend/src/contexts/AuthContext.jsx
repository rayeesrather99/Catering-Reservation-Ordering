"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get(`${API_URL}/api/users/me`)
          setUser(res.data)
        }
      } catch (error) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return res.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData)
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return res.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const updateProfile = async (userData) => {
    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, userData)
      setUser(res.data)
      return res.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Profile update failed")
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

