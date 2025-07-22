import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"

interface NutritionGoals {
  daily_calorie_goal: number
  daily_water_goal: number
  daily_protein_goal: number
  daily_carbs_goal: number
  daily_fats_goal: number
}

interface NutritionGoalsProps {
  goals: NutritionGoals
  isEditing: boolean
  onGoalsChange: (goals: NutritionGoals) => void
}

export function NutritionGoals({ goals, isEditing, onGoalsChange }: NutritionGoalsProps) {
  // Helper function to handle empty/null values
  const handleNumberInput = (value: string, field: keyof NutritionGoals) => {
    const numberValue = value === "" ? 0 : Number(value)
    onGoalsChange({ ...goals, [field]: numberValue })
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Zap className="w-5 h-5 mr-2 text-orange-600" />
          Nutrition Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Calories (kcal)</label>
            <Input
              type="number"
              value={goals.daily_calorie_goal || ""}
              onChange={e => handleNumberInput(e.target.value, "daily_calorie_goal")}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Water (ml)</label>
            <Input
              type="number"
              value={goals.daily_water_goal || ""}
              onChange={e => handleNumberInput(e.target.value, "daily_water_goal")}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Protein (g)</label>
            <Input
              type="number"
              value={goals.daily_protein_goal || ""}
              onChange={e => handleNumberInput(e.target.value, "daily_protein_goal")}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Carbs (g)</label>
            <Input
              type="number"
              value={goals.daily_carbs_goal || ""}
              onChange={e => handleNumberInput(e.target.value, "daily_carbs_goal")}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Fats (g)</label>
            <Input
              type="number"
              value={goals.daily_fats_goal || ""}
              onChange={e => handleNumberInput(e.target.value, "daily_fats_goal")}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}