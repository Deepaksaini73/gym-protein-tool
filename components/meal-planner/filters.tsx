import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface FiltersProps {
  selectedGoal: string
  onGoalChange: (value: string) => void
  selectedDiet: string
  onDietChange: (value: string) => void
  dietFilters: string[]
}

export function Filters({
  selectedGoal,
  onGoalChange,
  selectedDiet,
  onDietChange,
  dietFilters,
}: FiltersProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Goal:</label>
              <Select value={selectedGoal} onValueChange={onGoalChange}>
                <SelectTrigger className="w-full border-2 focus:border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                  <SelectItem value="fatLoss">Fat Loss</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Diet:</label>
              <Select value={selectedDiet} onValueChange={onDietChange}>
                <SelectTrigger className="w-full border-2 focus:border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietFilters.map((diet) => (
                    <SelectItem key={diet} value={diet}>
                      {diet.charAt(0).toUpperCase() + diet.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 