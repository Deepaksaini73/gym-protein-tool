import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap, Edit3 } from "lucide-react"

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
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Edit3 className="w-5 h-5 mr-2 text-purple-600" />
          Quick Add Food
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Enter any food name and let AI calculate nutrition automatically
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Feature Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs border-purple-200">
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs border-indigo-200">
            <Edit3 className="w-3 h-3 mr-1" />
            Editable Nutrition
          </Badge>
        </div>

        {/* Input and Button */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., Homemade biryani, Grilled chicken..."
              value={customFoodName}
              onChange={(e) => onCustomFoodNameChange(e.target.value)}
              className="flex-1 border-2 focus:border-purple-400 bg-white/80"
              onKeyPress={(e) => e.key === "Enter" && customFoodName.trim() && onShowCustomDialog()}
            />
            <Button
              onClick={onShowCustomDialog}
              disabled={!customFoodName.trim()}
              className="bg-purple-600 hover:bg-purple-700 px-4"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-white/50 p-2 rounded-lg border border-purple-100">
            💡 <strong>Tip:</strong> Be specific for better results (e.g., "200g chicken curry" instead of just "curry")
          </div>
        </div>
      </CardContent>
    </Card>
  )
}