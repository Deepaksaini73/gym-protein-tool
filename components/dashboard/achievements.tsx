import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Check, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Achievement {
  name: string
  icon: string
  earned: boolean
  progress?: number
  description?: string
  requirement?: number
  currentCount?: number
  earnedAt?: string
}

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg text-gray-900">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements
          </div>
          <span className="text-sm font-normal text-gray-600">
            {achievements.filter((a) => a.earned).length}/{achievements.length} Earned
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-sm"
                  : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
              }`}
            >
              <div className="space-y-3">
                {/* Achievement Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <span className="text-2xl">{achievement.icon}</span>
                      {achievement.earned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {!achievement.earned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          achievement.earned ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {achievement.name}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {achievement.earned ? (
                      <div className="text-right">
                        <span className="text-sm text-emerald-600 font-medium">
                          ✓ Earned!
                        </span>
                        {achievement.earnedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-sm font-medium text-blue-600">
                          {Math.round(achievement.progress || 0)}%
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Progress</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Unearned Achievements */}
                {!achievement.earned && (
                  <div className="space-y-2">
                    <Progress value={achievement.progress || 0} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {achievement.currentCount || 0} / {achievement.requirement}
                      </span>
                      <span className="text-blue-600 font-medium">
                        {achievement.requirement && achievement.currentCount !== undefined
                          ? `${achievement.requirement - achievement.currentCount} more to go!`
                          : "Keep going!"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Requirement Text */}
                {!achievement.earned && achievement.requirement && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800 font-medium">
                        How to earn:
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      {getRequirementText(achievement)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get requirement text
function getRequirementText(achievement: Achievement): string {
  const requirements = {
    "First Food Log": "Log your first meal to get started",
    "3 Day Streak": "Log meals for 3 consecutive days",
    "Weekly Warrior": "Maintain a 7 day logging streak",
    "Hydration Hero": "Meet your daily water goal for 5 days",
    "Protein Perfect": "Meet your daily protein goal for 5 days",
    "Calorie Counter": "Stay within your calorie goal for 7 days",
  }
  return (
    requirements[achievement.name as keyof typeof requirements] ||
    `Complete ${achievement.requirement} to earn this achievement`
  )
}