import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FoodItem {
  id: number
  name: string
  calories: number
  protein: number
  carbs?: number
  fats?: number
  per: string
}

interface FoodDialogData {
  food: FoodItem
  quantity: number
  mealType: string
}

interface FoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  foodDialogData: FoodDialogData | null
  onFoodDialogDataChange: (data: FoodDialogData) => void
  onAddFood: () => void
}

export function FoodDialog({
  open,
  onOpenChange,
  foodDialogData,
  onFoodDialogDataChange,
  onAddFood,
}: FoodDialogProps) {
  if (!foodDialogData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Food to Log</DialogTitle>
          <DialogDescription>Adjust the quantity and select meal type</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">{foodDialogData.food.name}</h3>
            <p className="text-sm text-gray-600">
              {Math.round(foodDialogData.food.calories * (foodDialogData.quantity / 100))} calories,{" "}
              {Math.round(foodDialogData.food.protein * (foodDialogData.quantity / 100) * 10) / 10}g protein
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <Input
              id="quantity"
              type="number"
              value={foodDialogData.quantity}
              onChange={(e) =>
                onFoodDialogDataChange({
                  ...foodDialogData,
                  quantity: Number.parseInt(e.target.value) || 0,
                })
              }
              className="border-2 focus:border-emerald-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <select
              id="mealType"
              value={foodDialogData.mealType}
              onChange={(e) =>
                onFoodDialogDataChange({
                  ...foodDialogData,
                  mealType: e.target.value,
                })
              }
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-emerald-300"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddFood} className="bg-emerald-600 hover:bg-emerald-700">
            Add to Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 