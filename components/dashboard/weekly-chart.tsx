import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface WeeklyData {
  day: string
  calories: number
  protein: number
  water: number
}

interface WeeklyChartProps {
  weeklyData: WeeklyData[]
  avgCalories: number
}

export function WeeklyChart({ weeklyData, avgCalories }: WeeklyChartProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
          Weekly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple Bar Chart */}
          <div className="grid grid-cols-7 gap-1 h-32">
            {weeklyData.map((day, index) => {
              const calorieHeight = (day.calories / 2500) * 100
              const isToday = index === 6
              return (
                <div key={day.day} className="flex flex-col items-center space-y-2">
                  <div className="flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isToday
                          ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                          : "bg-gradient-to-t from-gray-400 to-gray-300"
                      }`}
                      style={{ height: `${calorieHeight}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isToday ? "text-emerald-700" : "text-gray-600"}`}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Daily Calorie Intake</p>
            <p className="text-xs text-gray-500">This Week Average: {avgCalories} cal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 