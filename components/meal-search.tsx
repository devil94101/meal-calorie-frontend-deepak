import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, ChevronsUpDown } from "lucide-react";
import { useMealStore, SavedMeal } from "@/lib/store/meal-store";
import { cn } from "@/lib/utils";

interface MealSearchProps {
  onSelect: (meal: {
    dish_name: string;
    servings: number;
    calories_per_serving: number;
    total_calories: number;
    source: string;
  }) => void;
}

export function MealSearch({ onSelect }: MealSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getSearchedMeals } = useMealStore();
  const searchedMeals = getSearchedMeals(searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <Search className="mr-2 h-4 w-4" />
          {searchQuery ? searchQuery : "Search saved meals..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search saved meals..." 
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>No saved meals found.</CommandEmpty>
            <CommandGroup>
              {searchedMeals.map((meal: SavedMeal) => (
                <CommandItem
                  key={meal.dish_name}
                  onSelect={() => {
                    onSelect({
                      dish_name: meal.dish_name,
                      servings: 1,
                      calories_per_serving: meal.calories_per_serving,
                      total_calories: meal.calories_per_serving,
                      source: meal.source,
                    });
                    setOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="flex flex-col">
                    <span>{meal.dish_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {meal.calories_per_serving} calories per serving
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 