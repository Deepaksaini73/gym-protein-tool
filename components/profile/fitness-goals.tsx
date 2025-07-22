import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target } from "lucide-react"

interface FitnessGoals {
  fitnessGoal: string
  targetWeight: number
  activityLevel: string
}

interface FitnessGoalsProps {
  goals: FitnessGoals
  isEditing: boolean
  onGoalsChange: (goals: FitnessGoals) => void
}

export function FitnessGoals({ goals, isEditing, onGoalsChange }: FitnessGoalsProps) {
  // Helper function to handle empty/null values
  const handleNumberInput = (value: string) => {
    const numberValue = value === '' ? 0 : Number(value)
    onGoalsChange({ ...goals, targetWeight: numberValue })
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Fitness Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Primary Goal</label>
            <Select
              value={goals.fitnessGoal}
              onValueChange={(value) => onGoalsChange({ ...goals, fitnessGoal: value })}
              disabled={!isEditing}
            >
              <SelectTrigger className="border-2 focus:border-emerald-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="fat_loss">Fat Loss</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Target Weight (kg)</label>
              <Input
                type="number"
                value={goals.targetWeight || ''}
                onChange={(e) => handleNumberInput(e.target.value)}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Activity Level</label>
              <Select
                value={goals.activityLevel}
                onValueChange={(value) => onGoalsChange({ ...goals, activityLevel: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className="border-2 focus:border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}