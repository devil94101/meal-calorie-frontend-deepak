export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack" | "search";

export interface Meal {
  id: string;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
  category: MealCategory;
  timestamp: number;
}

export type SavedMealCategory = Exclude<MealCategory, "search">; 