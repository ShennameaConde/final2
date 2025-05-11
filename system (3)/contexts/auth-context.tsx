"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: number
  name: string
  email: string
  role: "admin" | "user"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're in development mode and use mock data if backend is unavailable
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }).catch(() => {
          // If fetch fails (e.g., backend not running), return null to trigger the fallback
          return null
        })

        if (response && response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Check for stored user in localStorage as fallback (for development)
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        // Don't throw error, just log it
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // For development/demo purposes - mock successful login if API is unavailable
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_API === "true" || !process.env.NEXT_PUBLIC_API_URL

      if (isMockMode) {
        // Mock user data for demonstration
        const mockUser = {
          id: 1,
          name: email.split("@")[0],
          email: email,
          role: email.includes("admin") ? "admin" : "user",
        }

        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)

        // Redirect based on role
        if (mockUser.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }

        return true
      }

      // Real API implementation
      try {
        // Get CSRF cookie
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
          method: "GET",
          credentials: "include",
        })

        // Login request
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error("Login failed")
        }

        const userData = await response.json()
        setUser(userData.user)

        // Store in localStorage as fallback
        localStorage.setItem("user", JSON.stringify(userData.user))

        // Redirect based on role
        if (userData.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }

        return true
      } catch (error) {
        console.error("API login error:", error)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // For development/demo purposes - mock successful registration if API is unavailable
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_API === "true" || !process.env.NEXT_PUBLIC_API_URL

      if (isMockMode) {
        // Mock user data for demonstration
        const mockUser = {
          id: Math.floor(Math.random() * 1000),
          name: name,
          email: email,
          role: "user",
        }

        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)

        router.push("/dashboard")
        return true
      }

      // Real API implementation
      try {
        // Get CSRF cookie
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
          method: "GET",
          credentials: "include",
        })

        // Register request
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: password,
            role: "user", // Default role for registration
          }),
        })

        if (!response.ok) {
          throw new Error("Registration failed")
        }

        const userData = await response.json()
        setUser(userData.user)

        // Store in localStorage as fallback
        localStorage.setItem("user", JSON.stringify(userData.user))

        router.push("/dashboard")
        return true
      } catch (error) {
        console.error("API registration error:", error)
        return false
      }
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // For development/demo purposes
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_API === "true" || !process.env.NEXT_PUBLIC_API_URL

      if (isMockMode) {
        localStorage.removeItem("user")
        setUser(null)
        router.push("/login")
        return
      }

      // Real API implementation
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear local user data even if API call fails
      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
