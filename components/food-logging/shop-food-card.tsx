// Create new ShopFoodCard component to replace PopularFoods
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coffee, Utensils, Store } from "lucide-react"

interface ShopFoodCardProps {
  onShopFoodClick: () => void
}

export function ShopFoodCard({ onShopFoodClick }: ShopFoodCardProps) {
  const examples = [
    { name: "Samosa", icon: "🥟" },
    { name: "Pepsi", icon: "🥤" },
    { name: "Vada Pav", icon: "🍔" },
    { name: "Ice Cream", icon: "🍦" },
    { name: "Tea/Coffee", icon: "☕" },
    { name: "Maggie", icon: "🍜" }
  ]

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-gray-900">
          <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
          Shop & Street Food
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Add popular Indian snacks, drinks, and street food items
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Examples Grid */}
        <div className="grid grid-cols-3 gap-2">
          {examples.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-2 bg-white/70 rounded-lg border border-orange-100"
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs text-gray-700 font-medium text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
            <Store className="w-3 h-3 mr-1" />
            50+ Items
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
            <Coffee className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
            <Utensils className="w-3 h-3 mr-1" />
            Street Food
          </Badge>
        </div>

        {/* Main Action Button */}
        <Button
          onClick={onShopFoodClick}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Shop & Street Foods
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Includes nutrition info powered by AI • Popular Indian foods
        </p>
      </CardContent>
    </Card>
  )
}