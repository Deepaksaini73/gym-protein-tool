"use client"
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
import { Badge } from "@/components/ui/badge"
import { Edit3, Calculator } from "lucide-react"
import { useState, useEffect } from "react"

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
  const [baseNutrition, setBaseNutrition] = useState<{
    calories: number
    protein: number
    carbs: number
    fats: number
    baseQuantity: number
  } | null>(null)

  // Store base nutrition values when dialog opens
  useEffect(() => {
    if (foodDialogData && !baseNutrition) {
      const baseQty = parseInt(foodDialogData.food.per.replace(/\D/g, '')) || foodDialogData.quantity
      setBaseNutrition({
        calories: foodDialogData.food.calories,
        protein: foodDialogData.food.protein,
        carbs: foodDialogData.food.carbs || 0,
        fats: foodDialogData.food.fats || 0,
        baseQuantity: baseQty
      })
    }
  }, [foodDialogData, baseNutrition])

  // Reset base nutrition when dialog closes
  useEffect(() => {
    if (!open) {
      setBaseNutrition(null)
    }
  }, [open])

  if (!foodDialogData) return null

  // Extract unit from the food.per field
  const unit = foodDialogData.food.per.replace(/\d+/g, '').trim() || 'g'

  // Calculate nutrition based on quantity ratio
  const calculateNutrition = (newQuantity: number) => {
    if (!baseNutrition) return

    const ratio = newQuantity / baseNutrition.baseQuantity
    
    const updatedFood = {
      ...foodDialogData.food,
      calories: Math.round(baseNutrition.calories * ratio * 10) / 10,
      protein: Math.round(baseNutrition.protein * ratio * 10) / 10,
      carbs: Math.round(baseNutrition.carbs * ratio * 10) / 10,
      fats: Math.round(baseNutrition.fats * ratio * 10) / 10,
    }

    onFoodDialogDataChange({
      ...foodDialogData,
      quantity: newQuantity,
      food: updatedFood
    })
  }

  // Handle quantity change with auto-calculation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value) || 0
    if (newQuantity >= 0) {
      calculateNutrition(newQuantity)
    }
  }

  // Quick quantity buttons
  const quickQuantities = [
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "150", value: 150 },
    { label: "200", value: 200 }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b bg-white rounded-t-lg">
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
            Confirm Food Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Review and edit nutrition before adding to your log
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="space-y-4 sm:space-y-6">
            {/* Food Name */}
            <div className="space-y-2">
              <Label htmlFor="foodName" className="text-sm font-medium">Food Name</Label>
              <Input
                id="foodName"
                type="text"
                value={foodDialogData.food.name}
                onChange={e =>
                  onFoodDialogDataChange({
                    ...foodDialogData,
                    food: {
                      ...foodDialogData.food,
                      name: e.target.value,
                    },
                  })
                }
                className="font-medium text-gray-900 border-2 focus:border-purple-400 h-12 text-base"
              />
            </div>

            {/* Quantity Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Quantity</Label>
                <Badge variant="outline" className="text-xs">
                  <Calculator className="w-3 h-3 mr-1" />
                  Auto-calc nutrition
                </Badge>
              </div>
              
              {/* Quantity Input */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="col-span-2 space-y-2">
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={foodDialogData.quantity}
                    onChange={handleQuantityChange}
                    className="border-2 focus:border-purple-400 h-12 text-base text-center font-semibold"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center h-12 px-2 border-2 border-gray-200 bg-gray-50 rounded-md">
                    <span className="text-gray-600 font-medium text-sm">{unit}</span>
                  </div>
                </div>
              </div>

              {/* Quick Quantity Buttons */}
              <div className="grid grid-cols-4 gap-1">
                {quickQuantities.map((qty) => (
                  <Button
                    key={qty.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => calculateNutrition(qty.value)}
                    className={`h-8 text-xs border ${
                      foodDialogData.quantity === qty.value
                        ? 'border-purple-400 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {qty.label}{unit}
                  </Button>
                ))}
              </div>
            </div>

            {/* Nutrition Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-base">Nutrition Information</h4>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  Per {foodDialogData.quantity}{unit}
                </Badge>
              </div>
              
              {/* Mobile-friendly nutrition grid */}
              <div className="space-y-3">
                {/* Calories - Full width on mobile for prominence */}
                <div className="space-y-2">
                  <Label htmlFor="calories" className="text-sm font-medium flex items-center">
                    🔥 Calories
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    step="0.1"
                    value={foodDialogData.food.calories}
                    onChange={(e) =>
                      onFoodDialogDataChange({
                        ...foodDialogData,
                        food: {
                          ...foodDialogData.food,
                          calories: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="border-2 focus:border-purple-400 h-12 text-base text-center font-semibold"
                  />
                </div>

                {/* Macros in a grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="protein" className="text-xs sm:text-sm font-medium text-center block">
                      💪 Protein
                    </Label>
                    <Input
                      id="protein"
                      type="number"
                      min="0"
                      step="0.1"
                      value={foodDialogData.food.protein}
                      onChange={(e) =>
                        onFoodDialogDataChange({
                          ...foodDialogData,
                          food: {
                            ...foodDialogData.food,
                            protein: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="border-2 focus:border-purple-400 h-11 text-sm text-center"
                    />
                    <span className="text-xs text-gray-500 text-center block">grams</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carbs" className="text-xs sm:text-sm font-medium text-center block">
                      🍞 Carbs
                    </Label>
                    <Input
                      id="carbs"
                      type="number"
                      min="0"
                      step="0.1"
                      value={foodDialogData.food.carbs || 0}
                      onChange={(e) =>
                        onFoodDialogDataChange({
                          ...foodDialogData,
                          food: {
                            ...foodDialogData.food,
                            carbs: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="border-2 focus:border-purple-400 h-11 text-sm text-center"
                    />
                    <span className="text-xs text-gray-500 text-center block">grams</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fats" className="text-xs sm:text-sm font-medium text-center block">
                      🥑 Fats
                    </Label>
                    <Input
                      id="fats"
                      type="number"
                      min="0"
                      step="0.1"
                      value={foodDialogData.food.fats || 0}
                      onChange={(e) =>
                        onFoodDialogDataChange({
                          ...foodDialogData,
                          food: {
                            ...foodDialogData.food,
                            fats: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="border-2 focus:border-purple-400 h-11 text-sm text-center"
                    />
                    <span className="text-xs text-gray-500 text-center block">grams</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Type */}
            <div className="space-y-2">
              <Label htmlFor="mealType" className="text-sm font-medium">🍽️ Meal Type</Label>
              <select
                id="mealType"
                value={foodDialogData.mealType}
                onChange={(e) =>
                  onFoodDialogDataChange({
                    ...foodDialogData,
                    mealType: e.target.value,
                  })
                }
                className="w-full p-3 h-12 border-2 border-gray-200 rounded-md focus:border-purple-400 bg-white text-base"
              >
                <option value="breakfast">🌅 Breakfast</option>
                <option value="lunch">☀️ Lunch</option>
                <option value="dinner">🌙 Dinner</option>
                <option value="snack">🍿 Snack</option>
              </select>
            </div>

            {/* Mobile spacing for footer */}
            <div className="h-4 sm:hidden"></div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 rounded-b-lg gap-2 flex-row">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 sm:h-10 text-base sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={onAddFood} 
            className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 h-11 sm:h-10 text-base font-semibold"
            disabled={!foodDialogData.quantity || foodDialogData.quantity <= 0}
          >
            Add to Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}