import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PopularFood {
  id: number
  name: string
  calories: number
  protein: number
}

interface PopularFoodsProps {
  popularFoods: PopularFood[]
  onFoodSelect: (food: any) => void
}

export function PopularFoods({ popularFoods, onFoodSelect }: PopularFoodsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900">Popular Foods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {popularFoods.map((food) => (
            <Button
              key={food.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start space-y-1 border-2 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent"
              onClick={() => onFoodSelect(food)}
            >
              <span className="font-medium text-sm text-gray-900">{food.name}</span>
              <span className="text-xs text-gray-600">{food.calories} cal</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 