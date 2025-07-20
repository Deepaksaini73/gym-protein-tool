"use client"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FoodLoggingHeader,
  PopularFoods,
  QuickAdd,
  SearchTab,
  PhotoTab,
  BarcodeTab,
  VoiceTab,
  TodaysMeals,
  WaterTracker,
  FoodDialog,
  CustomFoodDialog,
} from "@/components/food-logging"
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Drumstick, Sandwich, Droplet } from 'lucide-react'
import { Loader2 } from 'lucide-react'

// Mock food database
const mockFoodDatabase = [
  { id: 1, name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, per: "100g" },
  { id: 2, name: "Brown Rice", calories: 112, protein: 2.6, carbs: 23, fats: 0.9, per: "100g" },
  { id: 3, name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, per: "100g" },
  { id: 4, name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fats: 0.4, per: "100g" },
  { id: 5, name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, per: "100g" },
  { id: 6, name: "Salmon Fillet", calories: 208, protein: 25, carbs: 0, fats: 12, per: "100g" },
  { id: 7, name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, per: "100g" },
  { id: 8, name: "Almonds", calories: 579, protein: 21, carbs: 22, fats: 50, per: "100g" },
  { id: 9, name: "Avocado", calories: 160, protein: 2, carbs: 9, fats: 15, per: "100g" },
  { id: 10, name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fats: 11, per: "100g" },
]

const mockBarcodes = [
  { code: "123456789", name: "Protein Bar - Chocolate", calories: 200, protein: 20, carbs: 15, fats: 8 },
  { code: "987654321", name: "Oatmeal - Instant", calories: 150, protein: 5, carbs: 27, fats: 3 },
  { code: "456789123", name: "Almond Milk", calories: 40, protein: 1, carbs: 8, fats: 2.5 },
]

const todaysMeals = [
  {
    id: 1,
    name: "Breakfast",
    items: [
      { food: "Greek Yogurt", quantity: 150, calories: 89, protein: 15 },
      { food: "Banana", quantity: 120, calories: 107, protein: 1.3 },
    ],
    totalCalories: 196,
    time: "8:30 AM",
  },
  {
    id: 2,
    name: "Lunch",
    items: [
      { food: "Grilled Chicken Breast", quantity: 150, calories: 248, protein: 46.5 },
      { food: "Brown Rice", quantity: 100, calories: 112, protein: 2.6 },
      { food: "Broccoli", quantity: 80, calories: 27, protein: 2.2 },
    ],
    totalCalories: 387,
    time: "12:45 PM",
  },
]

const popularFoods = [
  { id: 1, name: "Grilled Chicken Breast", calories: 165, protein: 31 },
  { id: 4, name: "Greek Yogurt", calories: 59, protein: 10 },
  { id: 5, name: "Banana", calories: 89, protein: 1.1 },
  { id: 6, name: "Salmon Fillet", calories: 208, protein: 25 },
  { id: 9, name: "Avocado", calories: 160, protein: 2 },
  { id: 10, name: "Eggs", calories: 155, protein: 13 },
]

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

export default function FoodLoggingPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [loggedMeals, setLoggedMeals] = useState<any[]>([])
  const [isListening, setIsListening] = useState(false)
  const [showFoodDialog, setShowFoodDialog] = useState(false)
  const [foodDialogData, setFoodDialogData] = useState<FoodDialogData | null>(null)
  const [customFoodName, setCustomFoodName] = useState("")
  const [customFoodQuantity, setCustomFoodQuantity] = useState("")
  const [customFoodUnit, setCustomFoodUnit] = useState("g")
  const [showCustomFoodDialog, setShowCustomFoodDialog] = useState(false)
  const [geminiSuggestions, setGeminiSuggestions] = useState<any[]>([])
  const geminiTimeout = useRef<NodeJS.Timeout | null>(null)
  const [geminiLoading, setGeminiLoading] = useState(false)

  const filteredFoods = mockFoodDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate today's summary
  const summary = loggedMeals.reduce(
    (acc, meal) => {
      meal.items.forEach((item: any) => {
        acc.calories += item.calories || 0
        acc.protein += item.protein || 0
        acc.carbs += item.carbs || 0
        acc.fats += item.fats || 0
      })
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  // Smart Gemini-powered search (show suggestions even if local match is partial)
  useEffect(() => {
    if (searchQuery.trim()) {
      setGeminiLoading(true)
      if (geminiTimeout.current) clearTimeout(geminiTimeout.current)
      geminiTimeout.current = setTimeout(async () => {
        const res = await fetch("/api/food-search-gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        })
        const data = await res.json()
        if (data && data.suggestions) {
          setGeminiSuggestions(data.suggestions.map((item: any, idx: number) => ({
            id: 10000 + idx,
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            per: "1 serving",
          })))
        } else {
          setGeminiSuggestions([])
        }
        setGeminiLoading(false)
      }, 500)
    } else {
      setGeminiSuggestions([])
      setGeminiLoading(false)
    }
    return () => {
      if (geminiTimeout.current) clearTimeout(geminiTimeout.current)
    }
  }, [searchQuery])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      alert("Image uploaded! AI analysis will identify the food and estimate nutrition.")
    }
  }

  // Barcode search with Gemini
  const handleBarcodeSearch = async () => {
    if (!barcodeInput.trim()) return
    try {
      const res = await fetch("/api/food-nutrition-barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: barcodeInput }),
      })
      const data = await res.json()
      if (data && data.nutrition && data.nutrition.food_name) {
        openFoodDialog({
          id: Date.now(),
          name: data.nutrition.food_name,
          calories: data.nutrition.calories,
          protein: data.nutrition.protein,
          carbs: data.nutrition.carbs,
          fats: data.nutrition.fats,
          per: data.nutrition.per || "1 serving",
        })
        setBarcodeInput("")
      } else {
        alert("Could not get nutrition info for this barcode.")
      }
    } catch (err) {
      alert("Error contacting AI service.")
    }
  }

  const handleVoiceInput = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      alert("Voice recognized: 'I had grilled chicken with rice and broccoli'")
    }, 3000)
  }

  const openFoodDialog = (food: FoodItem) => {
    setFoodDialogData({
      food,
      quantity: 100,
      mealType: "breakfast",
    })
    setShowFoodDialog(true)
  }

  // Save food log to Supabase
  const handleAddFood = async () => {
    if (foodDialogData && user) {
      const { food, quantity, mealType } = foodDialogData
      const today = new Date().toISOString().slice(0, 10)
      const { error } = await supabase.from('food_logs').insert({
        user_id: user.id,
        date: today,
        meal_type: mealType,
        food_name: food.name,
        quantity,
        unit: food.per.replace(/\d+/g, ''),
        calories: Math.round(food.calories * (quantity / 100)),
        protein: Math.round(food.protein * (quantity / 100) * 10) / 10,
        carbs: food.carbs ? Math.round(food.carbs * (quantity / 100) * 10) / 10 : null,
        fats: food.fats ? Math.round(food.fats * (quantity / 100) * 10) / 10 : null,
      })
      if (!error) {
        setShowFoodDialog(false)
        setFoodDialogData(null)
        // Refetch logs
        const today = new Date().toISOString().slice(0, 10)
        const { data } = await supabase
          .from('food_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: true })
        if (data) {
          const meals = ['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => ({
            name: meal.charAt(0).toUpperCase() + meal.slice(1),
            id: meal,
            items: data.filter((item) => item.meal_type === meal).map((item) => ({
              food: item.food_name,
              quantity: item.quantity,
              calories: item.calories,
              protein: item.protein,
            })),
            totalCalories: data.filter((item) => item.meal_type === meal).reduce((sum, item) => sum + (item.calories || 0), 0),
            time: '',
          }))
          setLoggedMeals(meals)
        }
      } else {
        alert('Failed to save food log.')
      }
    }
  }

  // New: handle custom food submit with Gemini
  const handleCustomFood = async () => {
    if (customFoodName.trim() && customFoodQuantity && customFoodUnit) {
      // Call Gemini API route
      try {
        const res = await fetch("/api/food-nutrition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodName: customFoodName,
            quantity: customFoodQuantity,
            unit: customFoodUnit,
          }),
        })
        const data = await res.json()
        if (data && data.nutrition) {
          // Show FoodDialog with Gemini nutrition result
          openFoodDialog({
            id: Date.now(),
            name: customFoodName,
            calories: data.nutrition.calories,
            protein: data.nutrition.protein,
            carbs: data.nutrition.carbs,
            fats: data.nutrition.fats,
            per: `${customFoodQuantity}${customFoodUnit}`,
          })
          setShowCustomFoodDialog(false)
          setCustomFoodName("")
          setCustomFoodQuantity("")
          setCustomFoodUnit("g")
        } else {
          alert("Could not get nutrition info. Please try again.")
        }
      } catch (err) {
        alert("Error contacting AI service.")
      }
    }
  }

  const addWater = (amount: number) => {
    alert(`Added ${amount}ml water to your log!`)
  }

  // Delete food log from Supabase
  const deleteMealItem = (mealId: number, itemIndex: number, logId?: string): void => {
    (async () => {
      if (!logId) return
      await supabase.from('food_logs').delete().eq('id', logId)
      // Refetch logs
      if (user) {
        const today = new Date().toISOString().slice(0, 10)
        const { data } = await supabase
          .from('food_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: true })
        if (data) {
          const meals = ['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => ({
            name: meal.charAt(0).toUpperCase() + meal.slice(1),
            id: meal,
            items: data.filter((item) => item.meal_type === meal).map((item) => ({
              food: item.food_name,
              quantity: item.quantity,
              calories: item.calories,
              protein: item.protein,
              logId: item.id,
            })),
            totalCalories: data.filter((item) => item.meal_type === meal).reduce((sum, item) => sum + (item.calories || 0), 0),
            time: '',
          }))
          setLoggedMeals(meals)
        }
      }
    })();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Summary Card */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-100 to-blue-100 mb-2">
          <CardContent className="flex justify-between items-center py-4">
            <div className="flex flex-col items-center flex-1">
              <Flame className="w-6 h-6 text-orange-500 mb-1" />
              <span className="font-bold text-lg text-gray-900">{summary.calories}</span>
              <span className="text-xs text-gray-600">Calories</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <Drumstick className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="font-bold text-lg text-gray-900">{summary.protein}</span>
              <span className="text-xs text-gray-600">Protein (g)</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <Sandwich className="w-6 h-6 text-yellow-600 mb-1" />
              <span className="font-bold text-lg text-gray-900">{summary.carbs}</span>
              <span className="text-xs text-gray-600">Carbs (g)</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <Droplet className="w-6 h-6 text-blue-500 mb-1" />
              <span className="font-bold text-lg text-gray-900">{summary.fats}</span>
              <span className="text-xs text-gray-600">Fats (g)</span>
            </div>
          </CardContent>
        </Card>
        {/* Header */}
        <FoodLoggingHeader />

        {/* Quick Popular Foods */}
        <PopularFoods popularFoods={popularFoods} onFoodSelect={openFoodDialog} />

        {/* Manual Food Entry */}
        <QuickAdd
          customFoodName={customFoodName}
          onCustomFoodNameChange={setCustomFoodName}
          onCustomFoodSubmit={handleCustomFood}
          onShowCustomDialog={() => setShowCustomFoodDialog(true)}
        />

        {/* Food Input Methods */}
        <Tabs defaultValue="search" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="photo">Photo</TabsTrigger>
            <TabsTrigger value="barcode">Barcode</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search">
            <SearchTab
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              filteredFoods={filteredFoods.length > 0 ? filteredFoods : geminiSuggestions}
              onFoodSelect={openFoodDialog}
              geminiLoading={geminiLoading}
            />
          </TabsContent>

          {/* Photo Tab */}
          <TabsContent value="photo">
            <PhotoTab selectedImage={selectedImage} onImageUpload={handleImageUpload} />
          </TabsContent>

          {/* Barcode Tab */}
          <TabsContent value="barcode">
            <BarcodeTab
              barcodeInput={barcodeInput}
              onBarcodeInputChange={setBarcodeInput}
              onBarcodeSearch={handleBarcodeSearch}
              mockBarcodes={mockBarcodes}
            />
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent value="voice">
            <VoiceTab isListening={isListening} onVoiceInput={handleVoiceInput} />
          </TabsContent>
        </Tabs>

        {/* Today's Meals */}
        <TodaysMeals
          loggedMeals={loggedMeals}
          onDeleteMealItem={(mealId, itemIndex, logId) => deleteMealItem(mealId, itemIndex, logId)}
          onShowCustomDialog={() => setShowCustomFoodDialog(true)}
        />

        {/* Quick Add Water */}
        <WaterTracker onAddWater={addWater} />

        {/* Food Confirmation Dialog */}
        <FoodDialog
          open={showFoodDialog}
          onOpenChange={setShowFoodDialog}
          foodDialogData={foodDialogData}
          onFoodDialogDataChange={setFoodDialogData}
          onAddFood={handleAddFood}
        />

        {/* Custom Food Dialog */}
        <CustomFoodDialog
          open={showCustomFoodDialog}
          onOpenChange={setShowCustomFoodDialog}
          customFoodName={customFoodName}
          onCustomFoodNameChange={setCustomFoodName}
          customFoodQuantity={customFoodQuantity}
          onCustomFoodQuantityChange={setCustomFoodQuantity}
          customFoodUnit={customFoodUnit}
          onCustomFoodUnitChange={setCustomFoodUnit}
          onSubmit={handleCustomFood}
        />
      </div>
    </div>
  )
}
