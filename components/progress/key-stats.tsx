import { Card, CardContent } from "@/components/ui/card"

interface KeyStatsProps {
  streak: number
  totalMealsLogged: number
}

export function KeyStats({ streak, totalMealsLogged }: KeyStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{streak}</div>
          <p className="text-sm text-gray-600">Day Streak</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalMealsLogged}</div>
          <p className="text-sm text-gray-600">Meals Logged</p>
        </CardContent>
      </Card>
    </div>
  )
} 