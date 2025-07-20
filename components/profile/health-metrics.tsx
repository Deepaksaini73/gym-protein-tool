import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/lib/database"
import { Heart, Target, TrendingUp, Droplets, Zap } from "lucide-react"

interface HealthMetricsProps {
  profile: UserProfile
}

export function HealthMetrics({ profile }: HealthMetricsProps) {
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600', bg: 'bg-green-100' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getWeightProgress = () => {
    const start = profile.current_weight
    const target = profile.target_weight
    const current = profile.current_weight
    
    if (target > start) {
      // Gaining weight
      return Math.min(((current - start) / (target - start)) * 100, 100)
    } else {
      // Losing weight
      return Math.min(((start - current) / (start - target)) * 100, 100)
    }
  }

  const bmiInfo = getBMICategory(profile.bmi)
  const weightProgress = getWeightProgress()

  return (
    <div className="space-y-6">
      {/* BMI Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-900">
            <Heart className="w-5 h-5 mr-2 text-red-600" />
            Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{profile.bmi}</div>
              <p className="text-sm text-gray-600">BMI</p>
              <Badge className={`mt-1 ${bmiInfo.bg} ${bmiInfo.color} border-0`}>
                {bmiInfo.category}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{profile.current_weight}kg</div>
              <p className="text-sm text-gray-600">Current Weight</p>
              <p className="text-xs text-gray-500">Target: {profile.target_weight}kg</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Weight Progress</span>
              <span className="text-gray-900 font-medium">{Math.round(weightProgress)}%</span>
            </div>
            <Progress value={weightProgress} className="h-3 bg-gray-200" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-900">
            <Target className="w-5 h-5 mr-2 text-emerald-600" />
            Daily Nutrition Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-800">Calories</span>
              </div>
              <div className="text-xl font-bold text-orange-900">{profile.daily_calorie_goal}</div>
              <p className="text-xs text-orange-700">kcal/day</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Water</span>
              </div>
              <div className="text-xl font-bold text-blue-900">{profile.daily_water_goal / 1000}</div>
              <p className="text-xs text-blue-700">L/day</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-800">Protein</span>
              </div>
              <span className="text-lg font-bold text-purple-900">{profile.daily_protein_goal}g</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Carbs</span>
              </div>
              <span className="text-lg font-bold text-green-900">{profile.daily_carbs_goal}g</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Fats</span>
              </div>
              <span className="text-lg font-bold text-yellow-900">{profile.daily_fats_goal}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Info Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-900">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Fitness Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {profile.fitness_goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <p className="text-xs text-gray-600">Primary Goal</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {profile.activity_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <p className="text-xs text-gray-600">Activity Level</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-sm font-bold text-gray-900">{profile.height}cm</div>
              <p className="text-xs text-gray-600">Height</p>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{profile.age} years</div>
              <p className="text-xs text-gray-600">Age</p>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{profile.gender}</div>
              <p className="text-xs text-gray-600">Gender</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 