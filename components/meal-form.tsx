import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Utensils, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CalorieService } from "@/lib/services/calorie-services";
import { useMealStore } from "@/lib/store/meal-store";

const mealFormSchema = z.object({
  dish_name: z
    .string()
    .min(2, "Dish name must be at least 2 characters")
    .max(100, "Dish name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-.,]+$/,
      "Dish name can only contain letters, numbers, spaces, and basic punctuation"
    ),
  servings: z
    .number()
    .min(0.1, "Servings must be at least 0.1")
    .max(1000, "Servings must be less than 1000"),
  category: z.enum(["breakfast", "lunch", "dinner", "snack"], {
    required_error: "Please select a category",
  }),
});

type MealFormValues = z.infer<typeof mealFormSchema>;

interface MealFormProps {
  onSuccess?: () => void;
}

export function MealForm({ onSuccess }: MealFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { addMeal, clearError } = useMealStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealToConfirm, setMealToConfirm] = useState<{
    dish_name: string;
    servings: number;
    calories_per_serving: number;
    total_calories: number;
    source: string;
    category: "breakfast" | "lunch" | "dinner" | "snack";
  } | null>(null);

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      dish_name: "",
      servings: 1,
      category: "lunch",
    },
  });

  const handleCustomMealSubmit = async (data: MealFormValues) => {
    clearError();
    setIsSubmitting(true);

    try {
      const calorieData = await CalorieService.getCalories({
        dish_name: data.dish_name.trim(),
        servings: data.servings,
      });

      if (calorieData?.error) {
        form.setError("dish_name", {
          type: "manual",
          message: calorieData.error,
        });
        return;
      }

      // Set the meal data for confirmation
      setMealToConfirm({
        dish_name: calorieData.dish_name,
        servings: calorieData.servings,
        calories_per_serving: calorieData.calories_per_serving,
        total_calories: calorieData.total_calories,
        source: calorieData.source,
        category: data.category,
      });

      // Show confirmation dialog
      setIsConfirmDialogOpen(true);
    } catch (err: any) {
      console.error("Failed to add meal:", err);
      if (err?.error) {
        form.setError("dish_name", {
          type: "manual",
          message: err.error,
        });
        return;
      }
      form.setError("root", {
        type: "manual",
        message: "Failed to add meal. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmMeal = async () => {
    if (!mealToConfirm) return;

    try {
      const result = await addMeal(mealToConfirm);

      if (result.success) {
        toast.success("Meal added successfully!");
        setIsDialogOpen(false);
        setIsConfirmDialogOpen(false);
        form.reset();
        setMealToConfirm(null);
        onSuccess?.();
      }
    } catch (err) {
      console.error("Failed to confirm meal:", err);
      toast.error("Failed to add meal. Please try again.");
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button data-testid="add-meal-button">
            <Utensils className="w-4 h-4 mr-2" />
            Add New Meal
          </Button>
        </DialogTrigger>
        <DialogContent data-testid="meal-form-dialog">
          <DialogHeader>
            <DialogTitle>Add New Meal</DialogTitle>
            <DialogDescription>
              Enter a dish name to get calorie information from the USDA FoodData
              Central database.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleCustomMealSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="dish_name">Dish Name</Label>
              <Input
                id="dish_name"
                data-testid="dish-name-input"
                placeholder="e.g., chicken biryani, pizza slice, banana"
                {...form.register("dish_name")}
                aria-invalid={!!form.formState.errors.dish_name}
                disabled={isSubmitting}
                className={
                  form.formState.errors.dish_name ? "border-destructive" : ""
                }
              />
              {form.formState.errors.dish_name && (
                <p className="text-sm text-destructive mt-1" data-testid="dish-name-error">
                  {form.formState.errors.dish_name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="0.1"
                  max="1000"
                  step="0.1"
                  data-testid="servings-input"
                  {...form.register("servings", { valueAsNumber: true })}
                  aria-invalid={!!form.formState.errors.servings}
                  disabled={isSubmitting}
                  className={
                    form.formState.errors.servings ? "border-destructive" : ""
                  }
                />
                {form.formState.errors.servings && (
                  <p className="text-sm text-destructive mt-1" data-testid="servings-error">
                    {form.formState.errors.servings.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) =>
                    form.setValue("category", value as any)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="category"
                    className={
                      form.formState.errors.category ? "border-destructive" : ""
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
            </div>
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1" data-testid="lookup-calories-button">
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Looking up calories...
                  </>
                ) : (
                  "Look Up Calories"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  form.reset();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent data-testid="confirmation-dialog">
          <DialogHeader>
            <DialogTitle>Confirm Meal Details</DialogTitle>
            <DialogDescription>
              Please review the meal details before adding to your tracker.
            </DialogDescription>
          </DialogHeader>
          {mealToConfirm && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dish Name</Label>
                <p className="text-sm" data-testid="confirmation-dish-name">{mealToConfirm.dish_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Servings</Label>
                  <p className="text-sm" data-testid="confirmation-servings">{mealToConfirm.servings}</p>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <p className="text-sm capitalize" data-testid="confirmation-category">{mealToConfirm.category}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Calories</Label>
                <p className="text-sm" data-testid="confirmation-calories-per-serving">
                  {mealToConfirm.calories_per_serving} calories per serving
                </p>
                <p className="text-sm font-medium" data-testid="confirmation-total-calories">
                  Total: {mealToConfirm.total_calories} calories
                </p>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <p className="text-sm" data-testid="confirmation-source">{mealToConfirm.source}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmMeal} className="flex-1">
                  Add to Tracker
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsConfirmDialogOpen(false);
                    setMealToConfirm(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
