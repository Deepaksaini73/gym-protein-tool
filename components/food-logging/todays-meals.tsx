import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Utensils, Plus, Trash2 } from "lucide-react"

interface MealItem {
  food: string
  quantity: number
  unit: string // Add unit field
  calories: number
  protein: number
  carbs?: number
  fats?: number
  logId?: string
}

interface LoggedMeal {
  id: number | string
  name: string
  items: MealItem[]
  totalCalories: number
  time: string
}

interface TodaysMealsProps {
  loggedMeals: LoggedMeal[]
  onDeleteMealItem: (mealId: number | string, itemIndex: number, logId?: string) => void
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
          {loggedMeals.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No meals logged today</p>
              <Button
                variant="outline"
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={onShowCustomDialog}
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Meal
              </Button>
            </div>
          ) : (
            <>
              {loggedMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Utensils className="w-4 h-4 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{meal.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      {meal.totalCalories} cal
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {meal.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{item.food}</span>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {item.quantity}{item.unit} {/* Use actual unit from database */}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span className="flex items-center">
                              🔥 {item.calories} cal
                            </span>
                            <span className="flex items-center">
                              💪 {item.protein}g protein
                            </span>
                            {item.carbs !== undefined && item.carbs > 0 && (
                              <span className="flex items-center">
                                🍞 {item.carbs}g carbs
                              </span>
                            )}
                            {item.fats !== undefined && item.fats > 0 && (
                              <span className="flex items-center">
                                🥑 {item.fats}g fats
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                          onClick={() => onDeleteMealItem(meal.id, index, item.logId)}
                          title="Delete this item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                Add Another Meal
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}