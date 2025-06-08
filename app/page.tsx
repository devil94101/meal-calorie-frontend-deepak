"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    console.log("chalalll")
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/auth/signin")
      }
    }
  }, [isAuthenticated, isLoading, router])

  // The loading state is now handled by the AuthInitializer in providers
  return null
}
