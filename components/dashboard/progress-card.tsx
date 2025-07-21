import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, Plus } from "lucide-react"
import Link from "next/link"

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fats: number
  water: number
}

interface DailyIntake {
  calories: number
  protein: number
  carbs: number
  fats: number
  water: number
}

interface ProgressCardProps {
  dailyGoals: DailyGoals
  dailyIntake: DailyIntake
  hideWaterAdd?: boolean
}

export function ProgressCard({ dailyGoals, dailyIntake, hideWaterAdd }: ProgressCardProps) {
  const calorieProgress = (dailyIntake.calories / dailyGoals.calories) * 100
  const proteinProgress = (dailyIntake.protein / dailyGoals.protein) * 100
  const carbProgress = (dailyIntake.carbs / dailyGoals.carbs) * 100
  const fatProgress = (dailyIntake.fats / dailyGoals.fats) * 100
  const waterProgress = (dailyIntake.water / dailyGoals.water) * 100

  const addWater = (amount: number) => {
    alert(`Added ${amount}ml water to your log!`)
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg text-gray-900">
          <span>Today's Progress</span>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            {Math.round(calorieProgress)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories with visual indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Calories</span>
            <span className="text-sm text-gray-600">
              {dailyIntake.calories} / {dailyGoals.calories}
            </span>
          </div>
          <div className="relative">
            <Progress value={calorieProgress} className="h-4 bg-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-sm">
                {dailyGoals.calories - dailyIntake.calories} left
              </span>
            </div>
          </div>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700">{dailyIntake.protein}g</div>
              <p className="text-xs text-blue-600">Protein</p>
              <div className="mt-2">
                <Progress value={proteinProgress} className="h-2 bg-blue-200" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border-2 border-green-200">
            <div className="text-center">
              <div className="text-lg font-bold text-green-700">{dailyIntake.carbs}g</div>
              <p className="text-xs text-green-600">Carbs</p>
              <div className="mt-2">
                <Progress value={carbProgress} className="h-2 bg-green-200" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-700">{dailyIntake.fats}g</div>
              <p className="text-xs text-yellow-600">Fats</p>
              <div className="mt-2">
                <Progress value={fatProgress} className="h-2 bg-yellow-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Water Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-2 border-cyan-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-cyan-600" />
              <span className="font-medium text-cyan-800">Water Intake</span>
            </div>
            <span className="text-sm text-cyan-700">
              {dailyIntake.water} / {dailyGoals.water}ml
            </span>
          </div>
          <Progress value={waterProgress} className="h-3 bg-cyan-200 mb-3" />
          {!hideWaterAdd && (
            <div className="grid grid-cols-4 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent text-xs"
                onClick={() => addWater(250)}
              >
                +250ml
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent text-xs"
                onClick={() => addWater(500)}
              >
                +500ml
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent text-xs"
                onClick={() => addWater(750)}
              >
                +750ml
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent text-xs"
                onClick={() => addWater(1000)}
              >
                +1L
              </Button>
            </div>
          )}
        </div>

        {/* Quick Add Food Button */}
        <Link href="/food-logging">
          <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md">
            <Plus className="w-5 h-5 mr-2" />
            Log Food
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 