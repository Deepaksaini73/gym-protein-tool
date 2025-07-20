import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentMeal {
  name: string
  calories: number
  time: string
  type: string
}

interface RecentMealsProps {
  recentMeals: RecentMeal[]
}

export function RecentMeals({ recentMeals }: RecentMealsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900">Recent Meals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentMeals.map((meal, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    meal.type === "breakfast"
                      ? "bg-yellow-400"
                      : meal.type === "lunch"
                        ? "bg-orange-400"
                        : "bg-purple-400"
                  }`}
                />
                <div>
                  <p className="font-medium text-sm text-gray-900">{meal.name}</p>
                  <p className="text-xs text-gray-600">{meal.time}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                {meal.calories} cal
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 