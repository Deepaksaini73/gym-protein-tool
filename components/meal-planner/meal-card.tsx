import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, Plus } from "lucide-react"

interface Meal {
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
}

interface MealCardProps {
  meal: Meal
  onAddToPlan: (meal: Meal) => void
  onLogMeal: (meal: Meal) => void
}

export function MealCard({ meal, onAddToPlan, onLogMeal }: MealCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{meal.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
              {meal.calories} cal
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-2 border border-blue-200">
              <p className="text-xs text-blue-600">Protein</p>
              <p className="font-semibold text-blue-800">{meal.protein}g</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-2 border border-green-200">
              <p className="text-xs text-green-600">Carbs</p>
              <p className="font-semibold text-green-800">{meal.carbs}g</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded p-2 border border-yellow-200">
              <p className="text-xs text-yellow-600">Fats</p>
              <p className="font-semibold text-yellow-800">{meal.fats}g</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {meal.prepTime} min
            </div>
            <div className="flex items-center">
              <ChefHat className="w-4 h-4 mr-1" />
              {meal.difficulty}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {meal.dietTypes.map((diet) => (
              <Badge key={diet} variant="outline" className="text-xs border-gray-300">
                {diet}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              onClick={() => onAddToPlan(meal)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Plan
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onLogMeal(meal)}
            >
              Log Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 