import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"

interface WeeklySummaryProps {
  weeklyGoalsMet: number
  averageCalories: number
  totalWorkouts: number
}

export function WeeklySummary({ weeklyGoalsMet, averageCalories, totalWorkouts }: WeeklySummaryProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-700">Goals Met</span>
            <span className="text-sm font-medium text-gray-900">{weeklyGoalsMet}/7 days</span>
          </div>
          <Progress value={(weeklyGoalsMet / 7) * 100} className="h-3 bg-gray-200" />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{averageCalories}</div>
              <p className="text-xs text-gray-600">Avg Calories</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{totalWorkouts}</div>
              <p className="text-xs text-gray-600">Workouts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 