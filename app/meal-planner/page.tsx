"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MealPlannerHeader,
  Filters,
  SuggestedMeals,
  PlannedMeals,
} from "@/components/meal-planner"

// Mock meal data
const mockMeals = {
  muscleGain: [
    {
      id: 1,
      name: "High-Protein Breakfast Bowl",
      description: "Greek yogurt with granola, berries, and protein powder",
      calories: 450,
      protein: 35,
      carbs: 45,
      fats: 12,
      prepTime: 10,
      difficulty: "Easy",
      dietTypes: ["vegetarian"],
    },
    {
      id: 2,
      name: "Grilled Chicken Power Lunch",
      description: "Grilled chicken breast with quinoa and roasted vegetables",
      calories: 520,
      protein: 42,
      carbs: 38,
      fats: 18,
      prepTime: 25,
      difficulty: "Medium",
      dietTypes: ["gluten-free"],
    },
    {
      id: 3,
      name: "Post-Workout Smoothie",
      description: "Banana, protein powder, peanut butter, and oat milk",
      calories: 380,
      protein: 28,
      carbs: 35,
      fats: 14,
      prepTime: 5,
      difficulty: "Easy",
      dietTypes: ["vegetarian", "vegan"],
    },
  ],
  fatLoss: [
    {
      id: 4,
      name: "Green Goddess Salad",
      description: "Mixed greens with grilled salmon and avocado dressing",
      calories: 320,
      protein: 28,
      carbs: 12,
      fats: 18,
      prepTime: 15,
      difficulty: "Easy",
      dietTypes: ["keto", "paleo"],
    },
    {
      id: 5,
      name: "Zucchini Noodle Stir-Fry",
      description: "Spiralized zucchini with lean ground turkey and vegetables",
      calories: 280,
      protein: 25,
      carbs: 15,
      fats: 12,
      prepTime: 20,
      difficulty: "Medium",
      dietTypes: ["keto", "paleo", "gluten-free"],
    },
  ],
  maintenance: [
    {
      id: 7,
      name: "Mediterranean Bowl",
      description: "Quinoa with grilled chicken, olives, feta, and vegetables",
      calories: 420,
      protein: 30,
      carbs: 35,
      fats: 20,
      prepTime: 22,
      difficulty: "Medium",
      dietTypes: ["mediterranean", "gluten-free"],
    },
  ],
}

const dietFilters = ["all", "vegetarian", "vegan", "keto", "paleo", "mediterranean", "gluten-free"]

export default function MealPlannerPage() {
  const [selectedGoal, setSelectedGoal] = useState<keyof typeof mockMeals>("muscleGain")
  const [selectedDiet, setSelectedDiet] = useState("all")
  const [plannedMeals, setPlannedMeals] = useState<any[]>([])

  const getCurrentMeals = () => {
    const meals = mockMeals[selectedGoal]
    if (selectedDiet === "all") return meals
    return meals.filter((meal) => meal.dietTypes.includes(selectedDiet))
  }

  const addMealToPlan = (meal: any) => {
    setPlannedMeals([...plannedMeals, { ...meal, plannedFor: new Date().toISOString() }])
    alert(`Added "${meal.name}" to your meal plan!`)
  }

  const addMealToLog = (meal: any) => {
    alert(`Added "${meal.name}" to your food log!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <MealPlannerHeader />

        {/* Filters */}
        <Filters
          selectedGoal={selectedGoal}
          onGoalChange={(value: keyof typeof mockMeals) => setSelectedGoal(value)}
          selectedDiet={selectedDiet}
          onDietChange={setSelectedDiet}
          dietFilters={dietFilters}
        />

        <Tabs defaultValue="suggested" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
            <TabsTrigger value="planned">My Plan</TabsTrigger>
          </TabsList>

          {/* Suggested Meals */}
          <TabsContent value="suggested">
            <SuggestedMeals
              meals={getCurrentMeals()}
              onAddToPlan={addMealToPlan}
              onLogMeal={addMealToLog}
            />
          </TabsContent>

          {/* Planned Meals */}
          <TabsContent value="planned">
            <PlannedMeals plannedMeals={plannedMeals} onLogMeal={addMealToLog} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
