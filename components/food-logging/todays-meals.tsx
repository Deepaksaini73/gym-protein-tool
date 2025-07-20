import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Utensils, Plus, Trash2 } from "lucide-react"

interface MealItem {
  food: string
  quantity: number
  calories: number
  protein: number
  logId?: string
}

interface LoggedMeal {
  id: number
  name: string
  items: MealItem[]
  totalCalories: number
  time: string
}

interface TodaysMealsProps {
  loggedMeals: LoggedMeal[]
  onDeleteMealItem: (mealId: number, itemIndex: number, logId?: string) => void
  onShowCustomDialog: () => void
}

export function TodaysMeals({ loggedMeals, onDeleteMealItem, onShowCustomDialog }: TodaysMealsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Clock className="w-5 h-5 mr-2 text-emerald-600" />
          Today's Meals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loggedMeals.map((meal) => (
            <div
              key={meal.id}
              className="border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900">{meal.name}</h4>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  {meal.totalCalories} cal
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{meal.time}</p>

              <div className="space-y-2">
                {meal.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{item.food}</span>
                      <span className="text-xs text-gray-600 ml-2">({item.quantity}g)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">{item.calories} cal</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => onDeleteMealItem(meal.id, index, item.logId)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            onClick={onShowCustomDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Meal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 