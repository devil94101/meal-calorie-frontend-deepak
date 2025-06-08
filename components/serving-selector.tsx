import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

interface ServingSelectorProps {
  meal: {
    dish_name: string;
    calories_per_serving: number;
    source: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (servings: number, category: MealCategory) => void;
}

export function ServingSelector({ meal, open, onOpenChange, onConfirm }: ServingSelectorProps) {
  const [servings, setServings] = useState(1);
  const [category, setCategory] = useState<MealCategory>("lunch");

  const handleConfirm = () => {
    onConfirm(servings, category);
    onOpenChange(false);
    setServings(1);
    setCategory("lunch");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {meal.dish_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Calories per serving</Label>
            <div className="text-sm text-muted-foreground">
              {meal.calories_per_serving} calories
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              type="number"
              min="0.1"
              max="1000"
              step="0.1"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: MealCategory) => setCategory(value)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Add Meal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 