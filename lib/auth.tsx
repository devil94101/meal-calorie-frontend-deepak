"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface Session {
  user: User
  expires: string
}

interface AuthContextType {
  session: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/[...nextauth]?action=session")
      const sessionData = await response.json()

      if (sessionData && sessionData.user) {
        setSession(sessionData)
        setStatus("authenticated")
      } else {
        setSession(null)
        setStatus("unauthenticated")
      }
    } catch (error) {
      setSession(null)
      setStatus("unauthenticated")
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/[...nextauth]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, action: "signin" }),
      })

      const data = await response.json()

      if (data.success && data.session) {
        setSession(data.session)
        setStatus("authenticated")
        return { success: true }
      } else {
        return { success: false, error: data.error || "Sign in failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/[...nextauth]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signout" }),
      })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setSession(null)
      setStatus("unauthenticated")
    }
  }

  return <AuthContext.Provider value={{ session, status, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useSession() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useSession must be used within an AuthProvider")
  }
  return { data: context.session, status: context.status }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
