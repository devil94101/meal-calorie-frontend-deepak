import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MealForm } from "@/components/meal-form";
import { CalorieService } from "@/lib/services/calorie-services";
import { useMealStore } from "@/lib/store/meal-store";
import "@testing-library/jest-dom";

// Mock the CalorieService
jest.mock("@/lib/services/calorie-services", () => ({
  CalorieService: {
    getCalories: jest.fn(),
  },
}));

// Mock the meal store
jest.mock("@/lib/store/meal-store", () => ({
  useMealStore: jest.fn(),
}));

describe("MealForm", () => {
  const mockAddMeal = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useMealStore as jest.Mock).mockReturnValue({
      addMeal: mockAddMeal,
      clearError: mockClearError,
    });
  });

  const openForm = async () => {
    // Click the "Add New Meal" button to open the dialog
    fireEvent.click(screen.getByTestId("add-meal-button"));
    
    // Wait for the dialog to open
    await waitFor(() => {
      expect(screen.getByTestId("meal-form-dialog")).toBeInTheDocument();
    });
  };

  it("should submit form and display confirmation dialog with correct data", async () => {
    // Mock successful API response
    const mockCalorieData = {
      dish_name: "Chicken Biryani",
      servings: 2,
      calories_per_serving: 350,
      total_calories: 700,
      source: "USDA FoodData Central",
    };

    (CalorieService.getCalories as jest.Mock).mockResolvedValue(mockCalorieData);
    mockAddMeal.mockResolvedValue({ success: true });

    render(<MealForm />);
    await openForm();

    // Fill out the form
    const dishNameInput = screen.getByTestId("dish-name-input");
    const servingsInput = screen.getByTestId("servings-input");

    fireEvent.change(dishNameInput, {
      target: { value: "Chicken Biryani" },
    });
    fireEvent.change(servingsInput, {
      target: { value: "2" },
    });

    // Submit the form
    const submitButton = screen.getByTestId("lookup-calories-button");
    fireEvent.click(submitButton);

    // Wait for the confirmation dialog to appear
    await waitFor(() => {
      const dialog = screen.getByTestId("confirmation-dialog");
      expect(dialog).toBeInTheDocument();
    });

    // Wait for the meal data to be set and rendered
    await waitFor(() => {
      const dishName = screen.getByTestId("confirmation-dish-name");
      expect(dishName).toHaveTextContent("Chicken Biryani");
    });

    // Now verify all the data
    expect(screen.getByTestId("confirmation-servings")).toHaveTextContent("2");
    expect(screen.getByTestId("confirmation-calories-per-serving")).toHaveTextContent("350 calories per serving");
    expect(screen.getByTestId("confirmation-total-calories")).toHaveTextContent("Total: 700 calories");
    expect(screen.getByTestId("confirmation-source")).toHaveTextContent("USDA FoodData Central");
  });

  it("should handle API errors gracefully", async () => {
    // Mock API error
    const mockError = "Food not found in database";
    (CalorieService.getCalories as jest.Mock).mockResolvedValue({ error: mockError });

    render(<MealForm />);
    await openForm();

    // Fill out the form
    const dishNameInput = screen.getByTestId("dish-name-input");
    const servingsInput = screen.getByTestId("servings-input");

    fireEvent.change(dishNameInput, {
      target: { value: "Invalid Food" },
    });
    fireEvent.change(servingsInput, {
      target: { value: "1" },
    });

    // Submit the form
    const submitButton = screen.getByTestId("lookup-calories-button");
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId("dish-name-error")).toHaveTextContent(mockError);
    });

    // Verify confirmation dialog is not shown
    expect(screen.queryByTestId("confirmation-dialog")).not.toBeInTheDocument();
  });

  it("should validate form inputs before submission", async () => {
    render(<MealForm />);
    await openForm();

    // Try to submit without filling required fields
    const submitButton = screen.getByTestId("lookup-calories-button");
    fireEvent.click(submitButton);

    // Wait for validation messages to appear
    await waitFor(() => {
      expect(screen.getByTestId("dish-name-error")).toBeInTheDocument();
    });

    // Fill with invalid data
    const dishNameInput = screen.getByTestId("dish-name-input");
    const servingsInput = screen.getByTestId("servings-input");

    fireEvent.change(dishNameInput, {
      target: { value: "a" }, // Too short
    });
    fireEvent.change(servingsInput, {
      target: { value: "0" }, // Invalid servings
    });

    // Wait for updated validation messages
    await waitFor(() => {
      expect(screen.getByTestId("dish-name-error")).toHaveTextContent(/dish name must be at least 2 characters/i);
    });

    // Verify API is not called
    expect(CalorieService.getCalories).not.toHaveBeenCalled();
  });
}); 