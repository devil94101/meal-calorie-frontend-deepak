"use client";

import type React from "react";
import { useState } from "react";
import { useMealStore } from "@/lib/store/meal-store";
import { MealCategorySection } from "@/components/meal-category-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { MealForm } from "@/components/meal-form";
import { DailySummary } from "@/components/daily-summary";
import { MealSearch } from "@/components/meal-search";
import { ServingSelector } from "@/components/serving-selector";
import { toast } from "sonner";

type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

interface Meal {
  id: string;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
  category: MealCategory;
  timestamp: number;
}

export default function Meals() {
  const { removeMeal, getTodaysMeals, addMeal } = useMealStore();
  const [selectedMeal, setSelectedMeal] = useState<{
    dish_name: string;
    calories_per_serving: number;
    source: string;
  } | null>(null);

  const todaysTrackedMeals = getTodaysMeals();

  const mealsByCategory = todaysTrackedMeals.reduce(
    (acc, meal) => {
      acc[meal.category].push({
        ...meal,
        category: meal.category,
      });

      return acc;
    },
    {
      breakfast: [] as Meal[],
      lunch: [] as Meal[],
      dinner: [] as Meal[],
      snack: [] as Meal[],
    }
  );

  const totalCalories = todaysTrackedMeals.reduce(
    (sum, meal) => sum + meal.total_calories,
    0
  );

  const handleRemoveMeal = (id: string) => {
    removeMeal(id);
    toast.success("Meal removed successfully!");
  };

  const handleMealSelect = (meal: {
    dish_name: string;
    servings: number;
    calories_per_serving: number;
    total_calories: number;
    source: string;
  }) => {
    setSelectedMeal({
      dish_name: meal.dish_name,
      calories_per_serving: meal.calories_per_serving,
      source: meal.source,
    });
  };

  const handleServingConfirm = async (
    servings: number,
    category: MealCategory
  ) => {
    if (!selectedMeal) return;

    const result = await addMeal({
      dish_name: selectedMeal.dish_name,
      servings,
      calories_per_serving: selectedMeal.calories_per_serving,
      total_calories: selectedMeal.calories_per_serving * servings,
      source: selectedMeal.source,
      category,
    });

    if (result.success) {
      toast.success("Meal added successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meals</h2>
          <p className="text-muted-foreground">Track your meals and calories</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MealForm />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <MealSearch onSelect={handleMealSelect} />
        </div>
      </div>

      <DailySummary totalCalories={totalCalories} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MealCategorySection
          title="Breakfast"
          meals={mealsByCategory.breakfast}
          onRemoveMeal={handleRemoveMeal}
        />
        <MealCategorySection
          title="Lunch"
          meals={mealsByCategory.lunch}
          onRemoveMeal={handleRemoveMeal}
        />
        <MealCategorySection
          title="Dinner"
          meals={mealsByCategory.dinner}
          onRemoveMeal={handleRemoveMeal}
        />
        <MealCategorySection
          title="Snacks"
          meals={mealsByCategory.snack}
          onRemoveMeal={handleRemoveMeal}
        />
      </div>

      {selectedMeal && (
        <ServingSelector
          meal={selectedMeal}
          open={!!selectedMeal}
          onOpenChange={(open) => !open && setSelectedMeal(null)}
          onConfirm={handleServingConfirm}
        />
      )}
    </div>
  );
}
