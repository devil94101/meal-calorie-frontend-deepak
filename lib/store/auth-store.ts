import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id?: string
  firstName: string
  lastName: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  setLoading: (loading: boolean) => void
  getAuthHeaders: () => { Authorization: string } | {}
  checkAuth: () => Promise<void>
}

const API_BASE_URL = "https://flybackend-misty-feather-6458.fly.dev"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Changed to false by default

      signIn: async (email: string, password: string) => {
        set({ isLoading: true }) // Set loading when starting sign in
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (response.ok && data.token) {
            const user = {
              firstName: "User", // We'll get this from profile later
              lastName: "",
              email: email,
            }

            set({
              user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: data.error || "Login failed" }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: "Network error" }
        }
      },

      signUp: async (firstName: string, lastName: string, email: string, password: string) => {
        set({ isLoading: true }) // Set loading when starting sign up
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password }),
          })

          const data = await response.json()

          if (response.ok && data.token) {
            const user = {
              firstName,
              lastName,
              email,
            }

            set({
              user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          } else {
            set({ isLoading: false })
            const errorMessage = data.message || data.error || data.detail || "Registration failed"
            return { success: false, error: errorMessage }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: "Network error. Please try again." }
        }
      },

      signOut: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      getAuthHeaders: () => {
        const token = get().token
        return token ? { Authorization: `Bearer ${token}` } : {}
      },

      checkAuth: async () => {
        const state = get()
        // If we have a token and user, we're authenticated
        set({ isLoading: true })
        if (state.token && state.user) {
          set({ isAuthenticated: true, isLoading: false })
        } else {
          // If no token or user, clear the state
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
