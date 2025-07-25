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
              {dailyIntake.calories.toFixed(0)} / {dailyGoals.calories}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={Math.min(calorieProgress, 100)}
              className={`h-4 ${calorieProgress >= 100 ? "bg-green-200" : "bg-gray-200"}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {calorieProgress >= 100 ? (
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-green-800">🎯 Goal Completed!</span>
                </div>
              ) : (
                <span className="text-xs font-medium text-gray-800 bg-white/80 px-2 py-0.5 rounded-full">
                  {(dailyGoals.calories - dailyIntake.calories).toFixed(0)} left
                </span>
              )}
            </div>
          </div>
          {calorieProgress >= 100 && (
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                ✅ Daily goal achieved!
              </Badge>
            </div>
          )}
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div
            className={`rounded-lg p-3 border-2 transition-colors ${
              proteinProgress >= 100
                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-300"
                : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  proteinProgress >= 100 ? "text-green-700" : "text-blue-700"
                }`}
              >
                {dailyIntake.protein.toFixed(1)}g
              </div>
              <p
                className={`text-xs ${
                  proteinProgress >= 100 ? "text-green-600" : "text-blue-600"
                }`}
              >
                Protein {proteinProgress >= 100 ? "✅" : ""}
              </p>
              <div className="mt-2">
                <Progress
                  value={Math.min(proteinProgress, 100)}
                  className={`h-2 ${
                    proteinProgress >= 100 ? "bg-green-200" : "bg-blue-200"
                  }`}
                />
              </div>
              <div className="text-xs mt-1 text-gray-600">
                {proteinProgress >= 100
                  ? "Complete!"
                  : `${(dailyGoals.protein - dailyIntake.protein).toFixed(1)}g left`}
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div
            className={`rounded-lg p-3 border-2 transition-colors ${
              carbProgress >= 100
                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-300"
                : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  carbProgress >= 100 ? "text-green-700" : "text-orange-700"
                }`}
              >
                {dailyIntake.carbs.toFixed(1)}g
              </div>
              <p
                className={`text-xs ${
                  carbProgress >= 100 ? "text-green-600" : "text-orange-600"
                }`}
              >
                Carbs {carbProgress >= 100 ? "✅" : ""}
              </p>
              <div className="mt-2">
                <Progress
                  value={Math.min(carbProgress, 100)}
                  className={`h-2 ${
                    carbProgress >= 100 ? "bg-green-200" : "bg-orange-200"
                  }`}
                />
              </div>
              <div className="text-xs mt-1 text-gray-600">
                {carbProgress >= 100
                  ? "Complete!"
                  : `${(dailyGoals.carbs - dailyIntake.carbs).toFixed(1)}g left`}
              </div>
            </div>
          </div>

          {/* Fats */}
          <div
            className={`rounded-lg p-3 border-2 transition-colors ${
              fatProgress >= 100
                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-300"
                : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  fatProgress >= 100 ? "text-green-700" : "text-purple-700"
                }`}
              >
                {dailyIntake.fats.toFixed(1)}g
              </div>
              <p
                className={`text-xs ${
                  fatProgress >= 100 ? "text-green-600" : "text-purple-600"
                }`}
              >
                Fats {fatProgress >= 100 ? "✅" : ""}
              </p>
              <div className="mt-2">
                <Progress
                  value={Math.min(fatProgress, 100)}
                  className={`h-2 ${
                    fatProgress >= 100 ? "bg-green-200" : "bg-purple-200"
                  }`}
                />
              </div>
              <div className="text-xs mt-1 text-gray-600">
                {fatProgress >= 100
                  ? "Complete!"
                  : `${(dailyGoals.fats - dailyIntake.fats).toFixed(1)}g left`}
              </div>
            </div>
          </div>
        </div>

        {/* Water Section */}
        <div
          className={`rounded-lg p-4 border-2 transition-colors ${
            waterProgress >= 100
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
              : "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Droplets
                className={`w-5 h-5 ${
                  waterProgress >= 100 ? "text-green-600" : "text-cyan-600"
                }`}
              />
              <span
                className={`font-medium ${
                  waterProgress >= 100 ? "text-green-800" : "text-cyan-800"
                }`}
              >
                Water Intake {waterProgress >= 100 ? "✅" : ""}
              </span>
            </div>
            <span
              className={`text-sm ${
                waterProgress >= 100 ? "text-green-700" : "text-cyan-700"
              }`}
            >
              {dailyIntake.water} / {dailyGoals.water}ml
            </span>
          </div>
          <Progress
            value={Math.min(waterProgress, 100)}
            className={`h-3 mb-3 ${
              waterProgress >= 100 ? "bg-green-200" : "bg-cyan-200"
            }`}
          />
          {waterProgress >= 100 && (
            <div className="text-center mb-3">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                🎯 Hydration goal achieved!
              </Badge>
            </div>
          )}
          {!hideWaterAdd && (
            <div className="grid grid-cols-4 gap-2">
              <Button
                size="sm"
                variant="outline"
                className={`border-2 text-xs ${
                  waterProgress >= 100
                    ? "border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                    : "border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
                }`}
                onClick={() => addWater(250)}
              >
                +250ml
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`border-2 text-xs ${
                  waterProgress >= 100
                    ? "border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                    : "border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
                }`}
                onClick={() => addWater(500)}
              >
                +500ml
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`border-2 text-xs ${
                  waterProgress >= 100
                    ? "border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                    : "border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
                }`}
                onClick={() => addWater(750)}
              >
                +750ml
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`border-2 text-xs ${
                  waterProgress >= 100
                    ? "border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                    : "border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
                }`}
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