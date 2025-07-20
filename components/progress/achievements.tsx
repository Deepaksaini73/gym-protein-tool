import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

interface Achievement {
  name: string
  icon: string
  earned: boolean
}

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
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
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center border-2 ${
                achievement.earned
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className="text-xs font-medium text-gray-800">{achievement.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 