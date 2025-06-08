import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { CalorieResultCard } from "@/components/calorie-result-card"

interface Meal {
  id: string
  dish_name: string
  servings: number
  calories_per_serving: number
  total_calories: number
  source: string
  category: "breakfast" | "lunch" | "dinner" | "snack"
  timestamp: number
}

interface MealCategorySectionProps {
  title: string
  meals: Meal[]
  onRemoveMeal: (id: string) => void
}

export function MealCategorySection({ title, meals, onRemoveMeal }: MealCategorySectionProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.total_calories, 0)

  return (
    <Card className="h-full dark:bg-card dark:border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg dark:text-card-foreground">{title}</CardTitle>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">{totalCalories} calories</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <div key={meal.id} className="relative group">
                <CalorieResultCard
                  dish_name={meal.dish_name}
                  servings={meal.servings}
                  calories_per_serving={meal.calories_per_serving}
                  total_calories={meal.total_calories}
                  source={meal.source}
                  category={meal.category}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMeal(meal.id)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2 dark:text-muted-foreground/60">No meals added</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 