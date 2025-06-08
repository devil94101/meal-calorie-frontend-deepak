import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProfile {
  age: number
  weight: number
  height: number
  activityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active"
  fitnessGoal: "Lose Weight" | "Maintain Weight" | "Gain Weight" | "Build Muscle"
  dailyCalorieGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

interface UserSettings {
  notifications: boolean
  mealReminders: boolean
  weeklyReports: boolean
  theme: "Light" | "Dark" | "System"
}

interface UserState {
  profile: UserProfile
  settings: UserSettings
  updateProfile: (updates: Partial<UserProfile>) => void
  updateSettings: (updates: Partial<UserSettings>) => void
  resetProfile: () => void
}

const defaultProfile: UserProfile = {
  age: 28,
  weight: 70,
  height: 175,
  activityLevel: "Moderately Active",
  fitnessGoal: "Maintain Weight",
  dailyCalorieGoal: 2000,
  proteinGoal: 150,
  carbsGoal: 250,
  fatGoal: 65,
}

const defaultSettings: UserSettings = {
  notifications: true,
  mealReminders: true,
  weeklyReports: true,
  theme: "System",
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      settings: defaultSettings,

      updateProfile: (updates: Partial<UserProfile>) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }))
      },

      updateSettings: (updates: Partial<UserSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },

      resetProfile: () => {
        set({ profile: defaultProfile, settings: defaultSettings })
      },
    }),
    {
      name: "user-storage",
    },
  ),
)
