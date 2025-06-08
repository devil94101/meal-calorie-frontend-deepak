import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SavedMeal {
  dish_name: string
  calories_per_serving: number
  source: string
}

export interface TrackingMeal {
  id: string
  dish_name: string
  servings: number
  calories_per_serving: number
  total_calories: number
  source: string
  category: "breakfast" | "lunch" | "dinner" | "snack"
  timestamp: number
  isSearchResult?: boolean
}

interface MealStore {
  savedMeals: SavedMeal[]
  trackingMeals: TrackingMeal[]
  mealHistory: TrackingMeal[]
  isLoading: boolean
  error: string | null
  addMeal: (meal: Omit<TrackingMeal, "id" | "timestamp">) => Promise<{ success: boolean }>
  removeMeal: (id: string) => void
  getTodaysMeals: () => TrackingMeal[]
  getSearchedMeals: (query: string) => SavedMeal[]
  clearError: () => void
}

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      savedMeals: [],
      trackingMeals: [],
      mealHistory: [],
      isLoading: false,
      error: null,

      addMeal: async (meal) => {
        set({ isLoading: true, error: null })
        try {
          const newMeal: TrackingMeal = {
            ...meal,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          }

          // Add to tracking meals
          set((state) => ({
            trackingMeals: [...state.trackingMeals, newMeal],
          }))

          // Add to meal history
          set((state) => ({
            mealHistory: [...state.mealHistory, newMeal],
          }))

          // Add to saved meals if not a search result
          if (!meal.isSearchResult) {
            set((state) => {
              const exists = state.savedMeals.some(
                (m) => m.dish_name === meal.dish_name
              )
              if (!exists) {
                return {
                  savedMeals: [
                    ...state.savedMeals,
                    {
                      dish_name: meal.dish_name,
                      calories_per_serving: meal.calories_per_serving,
                      source: meal.source,
                    },
                  ],
                }
              }
              return state
            })
          }

          return { success: true }
        } catch (_) {
          set({ error: "Failed to add meal" })
          return { success: false }
        } finally {
          set({ isLoading: false })
        }
      },

      removeMeal: (id) => {
        // Only remove from tracking meals, keep in history
        set((state) => ({
          trackingMeals: state.trackingMeals.filter((meal) => meal.id !== id),
        }))
      },

      getTodaysMeals: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return get().trackingMeals.filter((meal) => {
          const mealDate = new Date(meal.timestamp)
          mealDate.setHours(0, 0, 0, 0)
          return mealDate.getTime() === today.getTime()
        })
      },

      getSearchedMeals: (query) => {
        const meals = get().savedMeals
        if (!query) return []
        return meals.filter((meal) =>
          meal.dish_name.toLowerCase().includes(query.toLowerCase())
        )
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "meal-storage",
      partialize: (state) => ({
        savedMeals: state.savedMeals,
        mealHistory: state.mealHistory, // Persist meal history
      }),
    }
  )
) 