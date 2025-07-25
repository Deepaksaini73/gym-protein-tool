import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { Loader2 } from "lucide-react"

interface FoodItem {
  id: number
  name: string
  calories: number
  protein: number
  carbs?: number
  fats?: number
  per: string
}

interface SearchTabProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  filteredFoods: FoodItem[]
  onFoodSelect: (foodName: string) => void // Changed to just pass food name
  geminiLoading?: boolean
}

export function SearchTab({
  searchQuery,
  onSearchQueryChange,
  filteredFoods,
  onFoodSelect,
  geminiLoading = false,
}: SearchTabProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Search className="w-5 h-5 mr-2 text-emerald-600" />
          Search Foods
        </CardTitle>
        <CardDescription>Search our database of foods and set your portion size</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for foods..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10 border-2 focus:border-emerald-300"
          />
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {geminiLoading && (
            <div className="flex items-center justify-center py-4 text-emerald-600">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Searching for foods...</span>
            </div>
          )}
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between p-3 border-2 border-gray-100 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
            >
              <div>
                <h4 className="font-medium text-sm text-gray-900">{food.name}</h4>
                <p className="text-xs text-gray-600">
                  {food.calories} cal, {food.protein}g protein per {food.per}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onFoodSelect(food.name)} // Pass food name only
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {/* Add custom search option */}
          {searchQuery && filteredFoods.length === 0 && !geminiLoading && (
            <div className="p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <Button
                variant="outline"
                onClick={() => onFoodSelect(searchQuery)}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Add "{searchQuery}" as custom food
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}