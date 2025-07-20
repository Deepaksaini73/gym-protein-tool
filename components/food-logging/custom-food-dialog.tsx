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

interface CustomFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customFoodName: string
  onCustomFoodNameChange: (value: string) => void
  customFoodQuantity: string
  onCustomFoodQuantityChange: (value: string) => void
  customFoodUnit: string
  onCustomFoodUnitChange: (value: string) => void
  onSubmit: () => void
}

export function CustomFoodDialog({
  open,
  onOpenChange,
  customFoodName,
  onCustomFoodNameChange,
  customFoodQuantity,
  onCustomFoodQuantityChange,
  customFoodUnit,
  onCustomFoodUnitChange,
  onSubmit,
}: CustomFoodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Food</DialogTitle>
          <DialogDescription>Enter the food name, quantity, and unit</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customFood">Food Name</Label>
            <Input
              id="customFood"
              value={customFoodName}
              onChange={(e) => onCustomFoodNameChange(e.target.value)}
              placeholder="e.g., Homemade pasta"
              className="border-2 focus:border-emerald-300"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="customFoodQuantity">Quantity</Label>
              <Input
                id="customFoodQuantity"
                type="number"
                value={customFoodQuantity}
                onChange={(e) => onCustomFoodQuantityChange(e.target.value)}
                placeholder="e.g., 150"
                className="border-2 focus:border-emerald-300"
              />
            </div>
            <div className="w-28">
              <Label htmlFor="customFoodUnit">Unit</Label>
              <select
                id="customFoodUnit"
                value={customFoodUnit}
                onChange={(e) => onCustomFoodUnitChange(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-emerald-300"
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="serving">serving</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 