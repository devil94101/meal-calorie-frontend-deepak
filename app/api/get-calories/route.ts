import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dish_name, servings } = body

    if (!dish_name || !servings) {
      return NextResponse.json(
        { error: "Dish name and servings are required" },
        { status: 400 }
      )
    }

    // TODO: Replace with actual API call to USDA FoodData Central
    // For now, return mock data
    const mockResponse = {
      dish_name,
      servings,
      calories_per_serving: 280,
      total_calories: 280 * servings,
      source: "USDA FoodData Central",
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error fetching calorie data:", error)
    return NextResponse.json(
      { error: "Failed to fetch calorie data" },
      { status: 500 }
    )
  }
} 