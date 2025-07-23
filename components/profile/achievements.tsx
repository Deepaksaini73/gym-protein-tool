import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Update the Achievements component
interface Achievement {
  name: string
  icon: string
  earned: boolean
  earnedAt?: string
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
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-200 h-16"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (achievements.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-900">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-500">No achievements yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Keep logging your meals to earn achievements!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg text-gray-900">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements
          </div>
          <span className="text-sm font-normal text-gray-600">
            {achievements.length} Earned
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border-2 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {achievement.name}
                  </h3>
                  {achievement.earnedAt && (
                    <p className="text-xs text-gray-500">
                      Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                  <span className="text-xs text-emerald-600 font-medium">
                    ✓ Completed!
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}