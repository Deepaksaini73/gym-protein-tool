import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface PlannedMeal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fats: number
  prepTime: number
  difficulty: string
  dietTypes: string[]
  plannedFor: string
}

interface PlannedMealsProps {
  plannedMeals: PlannedMeal[]
  onLogMeal: (meal: PlannedMeal) => void
}

export function PlannedMeals({ plannedMeals, onLogMeal }: PlannedMealsProps) {
  if (plannedMeals.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">No meals planned yet</h3>
          <p className="text-gray-600 mb-4">Start by adding some suggested meals to your plan</p>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => document.querySelector('[value="suggested"]')?.click()}
          >
            Browse Suggested Meals
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {plannedMeals.map((meal, index) => (
        <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                  <p className="text-sm text-gray-600">{meal.description}</p>
                  <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                    <span>{meal.calories} cal</span>
                    <span>{meal.protein}g protein</span>
                    <span>{meal.prepTime} min</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                >
                  View Recipe
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => onLogMeal(meal)}
                >
                  Log Meal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 