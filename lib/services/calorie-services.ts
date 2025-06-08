import { useAuthStore } from "@/lib/store/auth-store";
import { apiService } from "./api-service";

export interface CalorieResponse {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
  error?: string;
}

export interface CalorieRequest {
  dish_name: string;
  servings: number;
}

export class CalorieService {
  static async getCalories(request: CalorieRequest): Promise<CalorieResponse> {
    const { getAuthHeaders } = useAuthStore.getState();

    const data = await apiService.post(
      `/get-calories`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );

    return data as CalorieResponse;
  }
}
