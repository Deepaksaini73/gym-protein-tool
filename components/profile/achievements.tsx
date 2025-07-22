import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

interface Achievement {
  name: string
  icon: string
  earned: boolean
}

interface AchievementsProps {
  achievements: Achievement[]
  isLoading?: boolean
}

export function Achievements({ achievements, isLoading = false }: AchievementsProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-900">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="p-3 rounded-lg bg-gray-200 h-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Award className="w-5 h-5 mr-2 text-yellow-600" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.name}
              className={`p-3 rounded-lg ${
                achievement.earned
                  ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200"
                  : "bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h3
                    className={`font-medium ${
                      achievement.earned ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  {achievement.earned && (
                    <span className="text-xs text-emerald-600">Earned!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}