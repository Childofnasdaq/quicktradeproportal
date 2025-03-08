"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { generateMentorId } from "@/lib/utils"
import type { User } from "@/lib/types"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signup: (
    userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string },
  ) => Promise<{ success: boolean; error: string | null }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  isLoading: boolean
  approveUser: (userId: string) => Promise<boolean>
  rejectUser: (userId: string) => Promise<boolean>
  getPendingUsers: () => User[]
  getAllUsers: () => User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const publicPaths = ["/", "/signup", "/forgot-password"]
      const isPublicPath = publicPaths.includes(pathname)
      const adminPaths = ["/admin", "/admin/pending-users", "/admin/all-users"]
      const isAdminPath = pathname.startsWith("/admin")

      if (!user && !isPublicPath) {
        router.push("/")
      } else if (user && isPublicPath && pathname !== "/forgot-password") {
        // If user is admin, redirect to admin dashboard
        if (user.isAdmin) {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else if (user && isAdminPath && !user.isAdmin) {
        // If non-admin user tries to access admin paths
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const signup = async (userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string }) => {
    setIsLoading(true)
    try {
      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if email already exists - case insensitive check
      const emailExists = storedUsers.some((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())

      if (emailExists) {
        setIsLoading(false)
        return { success: false, error: "Email already exists" }
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        mentorId: generateMentorId(),
        email: userData.email.toLowerCase(), // Store email in lowercase
        approved: false, // New users are not approved by default
        isAdmin: false, // Regular users are not admins
      }

      storedUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(storedUsers))

      setIsLoading(false)
      return { success: true, error: null }
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, error: "Registration failed" }
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      // Case insensitive email check for login
      const foundUser = storedUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )

      if (foundUser) {
        // Check if user is approved or is an admin
        if (!foundUser.approved && !foundUser.isAdmin) {
          setIsLoading(false)
          return { success: false, error: "pending_approval" }
        }

        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        setIsLoading(false)
        return { success: true, error: null }
      }

      setIsLoading(false)
      return { success: false, error: "invalid_credentials" }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return { success: false, error: "login_failed" }
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return false

    try {
      const updatedUser = { ...user, ...userData }

      // Update in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Update in users array
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = storedUsers.map((u: any) => (u.id === user.id ? { ...u, ...userData } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update state
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const getPendingUsers = (): User[] => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      return storedUsers.filter((u: User) => !u.approved && !u.isAdmin)
    } catch (error) {
      console.error("Error getting pending users:", error)
      return []
    }
  }

  const getAllUsers = (): User[] => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      return storedUsers.filter((u: User) => !u.isAdmin) // Exclude admin users
    } catch (error) {
      console.error("Error getting all users:", error)
      return []
    }
  }

  const approveUser = async (userId: string): Promise<boolean> => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = storedUsers.map((u: User) => (u.id === userId ? { ...u, approved: true } : u))

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      return true
    } catch (error) {
      console.error("Error approving user:", error)
      return false
    }
  }

  const rejectUser = async (userId: string): Promise<boolean> => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = storedUsers.filter((u: User) => u.id !== userId)

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      return true
    } catch (error) {
      console.error("Error rejecting user:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
        approveUser,
        rejectUser,
        getPendingUsers,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

