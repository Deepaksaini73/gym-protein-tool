import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WaterTrackerProps {
  onAddWater: (amount: number) => void
}

export function WaterTracker({ onAddWater }: WaterTrackerProps) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-900">Quick Add Water</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
            onClick={() => onAddWater(250)}
          >
            + 250ml
          </Button>
          <Button
            variant="outline"
            className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
            onClick={() => onAddWater(500)}
          >
            + 500ml
          </Button>
          <Button
            variant="outline"
            className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
            onClick={() => onAddWater(750)}
          >
            + 750ml
          </Button>
          <Button
            variant="outline"
            className="border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-transparent"
            onClick={() => onAddWater(1000)}
          >
            + 1L
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 