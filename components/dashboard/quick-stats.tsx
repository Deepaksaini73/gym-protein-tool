import { Card, CardContent } from "@/components/ui/card"

interface QuickStatsProps {
  totalMeals: number
  avgCalories: number
  bestStreak: number
}

export function QuickStats({ totalMeals, avgCalories, bestStreak }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-emerald-700">{totalMeals}</div>
          <p className="text-xs text-emerald-600">Meals Logged</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-blue-700">{avgCalories}</div>
          <p className="text-xs text-blue-600">Avg Calories</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-purple-700">{bestStreak}</div>
          <p className="text-xs text-purple-600">Best Streak</p>
        </CardContent>
      </Card>
    </div>
  )
} 