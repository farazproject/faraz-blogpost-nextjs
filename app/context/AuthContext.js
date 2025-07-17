"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../lib/api"
import Cookies from "js-cookie"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from cookies
    const savedUser = Cookies.get("user")
    const token = Cookies.get("token")

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        Cookies.remove("user")
        Cookies.remove("token")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { user: userData, token } = response.data

      setUser(userData)
      Cookies.set("user", JSON.stringify(userData), { expires: 7 })
      Cookies.set("token", token, { expires: 7 })

      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed"
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { user: newUser, token } = response.data

      setUser(newUser)
      Cookies.set("user", JSON.stringify(newUser), { expires: 7 })
      Cookies.set("token", token, { expires: 7 })

      return { success: true, user: newUser }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed"
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("user")
    Cookies.remove("token")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
