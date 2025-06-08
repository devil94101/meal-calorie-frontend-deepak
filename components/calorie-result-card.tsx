import { Card, CardContent } from "@/components/ui/card"
import { SavedMealCategory } from "@/lib/types/meal"

interface CalorieResultProps {
  dish_name: string
  servings: number
  calories_per_serving: number
  total_calories: number
  source: string
  category: SavedMealCategory
}

export function CalorieResultCard({
  dish_name,
  servings,
  calories_per_serving,
  total_calories,
  source,
  category,
}: CalorieResultProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4 pr-12">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{dish_name}</h3>
              <p className="text-sm text-muted-foreground">
                {servings} {servings === 1 ? "serving" : "servings"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{total_calories} cal</p>
              <p className="text-sm text-muted-foreground">
                {calories_per_serving} cal/serving
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Source: {source}</span>
            <span className="capitalize">{category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 