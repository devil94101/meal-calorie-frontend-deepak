"use client"

import type React from "react"
import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuthStore } from "@/lib/store/auth-store"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Don't render children until auth is initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">CalorieTracker</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthInitializer>{children}</AuthInitializer>
    </ThemeProvider>
  )
}
