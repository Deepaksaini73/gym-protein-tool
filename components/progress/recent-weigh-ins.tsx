import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeightHistory {
  date: string
  weight: number
}

interface RecentWeighInsProps {
  weightHistory: WeightHistory[]
}

export function RecentWeighIns({ weightHistory }: RecentWeighInsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Recent Weigh-ins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weightHistory
            .slice(-4)
            .reverse()
            .map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-700">{new Date(entry.date).toLocaleDateString()}</span>
                <span className="font-medium text-gray-900">{entry.weight}kg</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
} 