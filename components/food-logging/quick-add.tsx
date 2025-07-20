import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface QuickAddProps {
  customFoodName: string
  onCustomFoodNameChange: (value: string) => void
  onCustomFoodSubmit: () => void
  onShowCustomDialog: () => void
}

export function QuickAdd({
  customFoodName,
  onCustomFoodNameChange,
  onCustomFoodSubmit,
  onShowCustomDialog,
}: QuickAddProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900">Quick Add</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter food name manually..."
            value={customFoodName}
            onChange={(e) => onCustomFoodNameChange(e.target.value)}
            className="flex-1 border-2 focus:border-emerald-300"
            onKeyPress={(e) => e.key === "Enter" && onCustomFoodSubmit()}
          />
          <Button onClick={onShowCustomDialog} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 