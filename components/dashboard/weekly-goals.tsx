import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface WeeklyGoalsProps {
  weeklyGoalsMet: number
}

export function WeeklyGoals({ weeklyGoalsMet }: WeeklyGoalsProps) {
  const progressPercentage = (weeklyGoalsMet / 7) * 100

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-emerald-900">Weekly Goals</h3>
              <p className="text-sm text-emerald-700">{weeklyGoalsMet}/7 days completed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-700">
              {Math.round(progressPercentage)}%
            </div>
            <p className="text-xs text-emerald-600">This Week</p>
          </div>
        </div>
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-3 bg-emerald-200" />
        </div>
      </CardContent>
    </Card>
  )
} 