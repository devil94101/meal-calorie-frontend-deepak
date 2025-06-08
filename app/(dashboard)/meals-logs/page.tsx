"use client";

import { useMealStore, TrackingMeal } from "@/lib/store/meal-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalorieResultCard } from "@/components/calorie-result-card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MealLogs() {
  const { mealHistory, removeMeal } = useMealStore();

  // Get all meals and group them by date
  const mealsByDate = mealHistory.reduce((acc: Record<string, TrackingMeal[]>, meal) => {
    const date = format(new Date(meal.timestamp), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(mealsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleRemoveMeal = (id: string) => {
    removeMeal(id);
    toast.success("Meal removed from tracker");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meal History</h2>
        <p className="text-muted-foreground">
          View your complete meal history
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Meals</TabsTrigger>
          <TabsTrigger value="saved">Saved Meals</TabsTrigger>
          <TabsTrigger value="searches">Search History</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {sortedDates.map((date) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(new Date(date), "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {mealsByDate[date].map((meal: TrackingMeal) => (
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
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {sortedDates.map((date) => {
            const savedMeals = mealsByDate[date].filter((meal: TrackingMeal) => 
              !meal.isSearchResult
            );
            
            if (savedMeals.length === 0) return null;

            return (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {savedMeals.map((meal: TrackingMeal) => (
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
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="searches" className="space-y-4">
          {sortedDates.map((date) => {
            const searchMeals = mealsByDate[date].filter((meal: TrackingMeal) => 
              meal.isSearchResult
            );
            
            if (searchMeals.length === 0) return null;

            return (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {searchMeals.map((meal: TrackingMeal) => (
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
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
