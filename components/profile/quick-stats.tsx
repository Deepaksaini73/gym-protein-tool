import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickStatsProps {
  bmi: string
  longestStreak: number
  totalMealsLogged: number
  isLoading?: boolean
}

export function QuickStats({ bmi, longestStreak, totalMealsLogged, isLoading = false }: QuickStatsProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{bmi}</div>
          <p className="text-sm text-gray-600">BMI</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-600">{longestStreak}</div>
            <p className="text-xs text-gray-600">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{totalMealsLogged}</div>
            <p className="text-xs text-gray-600">Meals Logged</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}