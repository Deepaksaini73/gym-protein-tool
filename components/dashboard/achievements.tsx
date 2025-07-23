import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award } from "lucide-react"

interface Achievement {
  name: string
  icon: string
  earned: boolean
  progress: number
}

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Award className="w-5 h-5 mr-2 text-yellow-600" />
          Achievement Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{achievement.name}</span>
                </div>
                <span className="text-sm text-gray-600">{achievement.progress.toFixed(2)}%</span>
              </div>
              <Progress
                value={achievement.progress}
                className={`h-2 ${achievement.earned ? "bg-green-200" : "bg-gray-200"}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 