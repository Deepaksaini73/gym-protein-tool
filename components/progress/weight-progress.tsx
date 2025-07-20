import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

interface WeightHistory {
  date: string
  weight: number
}

interface WeightProgressProps {
  weightHistory: WeightHistory[]
  currentWeight: number
  targetWeight: number
}

export function WeightProgress({ weightHistory, currentWeight, targetWeight }: WeightProgressProps) {
  const getWeightProgress = () => {
    const start = weightHistory[0].weight
    return ((currentWeight - start) / (targetWeight - start)) * 100
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{weightHistory[0].weight}kg</div>
            <p className="text-xs text-gray-600">Starting</p>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">{currentWeight}kg</div>
            <p className="text-xs text-gray-600">Current</p>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{targetWeight}kg</div>
            <p className="text-xs text-gray-600">Target</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-700">Progress to Goal</span>
            <span className="text-sm font-medium text-gray-900">
              {currentWeight}kg / {targetWeight}kg
            </span>
          </div>
          <Progress value={Math.min(getWeightProgress(), 100)} className="h-3 bg-gray-200" />
        </div>

        <Button
          variant="outline"
          className="w-full border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
        >
          Log New Weight
        </Button>
      </CardContent>
    </Card>
  )
} 