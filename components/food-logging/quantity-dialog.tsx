// Create the QuantityDialog component file
// filepath: d:\projects\MERN project\fitness-nutrition-tracker\components\food-logging\quantity-dialog.tsx
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
import { Calculator } from "lucide-react"

interface QuantityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  foodName: string
  quantity: string
  onQuantityChange: (value: string) => void
  unit: string
  onUnitChange: (value: string) => void
  onSubmit: () => void
  loading?: boolean
}

export function QuantityDialog({
  open,
  onOpenChange,
  foodName,
  quantity,
  onQuantityChange,
  unit,
  onUnitChange,
  onSubmit,
  loading = false
}: QuantityDialogProps) {
  const quickQuantities = [
    { label: "50", value: "50" },
    { label: "100", value: "100" },
    { label: "150", value: "150" },
    { label: "200", value: "200" }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Set Quantity
          </DialogTitle>
          <DialogDescription>
            How much of "{foodName}" did you consume?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Food Name Display */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900">{foodName}</h4>
          </div>

          {/* Quick Quantity Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-4 gap-1">
              {quickQuantities.map((qty) => (
                <Button
                  key={qty.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(qty.value)}
                  className={`h-10 text-sm border ${
                    quantity === qty.value
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {qty.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                placeholder="Enter amount"
                className="border-2 focus:border-blue-400 h-12 text-base text-center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium">Unit</Label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => onUnitChange(e.target.value)}
                className="w-full p-3 h-12 border-2 border-gray-200 rounded-md focus:border-blue-400 bg-white text-base"
              >
                <option value="g">grams (g)</option>
                <option value="ml">milliliters (ml)</option>
                <option value="serving">serving</option>
                <option value="cup">cup</option>
                <option value="piece">piece</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg border border-blue-100">
            💡 <strong>Tip:</strong> Be as accurate as possible for better nutrition tracking
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading || !quantity || Number(quantity) <= 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Getting Nutrition..." : "Get Nutrition Info"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}