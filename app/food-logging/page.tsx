"use client"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FoodLoggingHeader,
  PopularFoods,
  QuickAdd,
  SearchTab,
  PhotoTab,
  VoiceTab,
  TodaysMeals,
  WaterTracker,
  FoodDialog,
  CustomFoodDialog,
  ShopItemsDialog,
} from "@/components/food-logging"
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent , CardHeader, CardTitle} from '@/components/ui/card'
import BarcodeTab from "@/components/food-logging/barcode-tab";
import { Button } from '@/components/ui/button'
import { toast, Toaster } from 'sonner'
import { FeedbackButton } from "@/components/shared/feedback-button"
import { FeedbackForm } from "@/components/shared/feedback-form"
import { ShopFoodCard } from "@/components/food-logging/shop-food-card"

import { 
  Flame, 
  Drumstick, 
  Sandwich, 
  Droplet,
  Camera,
  Mic,
  Barcode,
  UtensilsCrossed,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation';

// Mock food database
const mockFoodDatabase = [
  { id: 1, name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, per: "100g" },
  { id: 2, name: "Brown Rice", calories: 112, protein: 2.6, carbs: 23, fats: 0.9, per: "100g" },
  { id: 3, name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, per: "100g" },
  { id: 4, name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, per: "100g" },
  { id: 5, name: "Avocado", calories: 160, protein: 2, carbs: 9, fats: 15, per: "100g" },
  { id: 6, name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fats: 11, per: "100g" },

  // Indian Food Items
  { id: 7, name: "Paneer", calories: 296, protein: 18.3, carbs: 1.2, fats: 22, per: "100g" },
  { id: 8, name: "Dal (Cooked Lentils)", calories: 116, protein: 9, carbs: 20, fats: 3, per: "100g" },
  { id: 9, name: "Roti (Whole Wheat)", calories: 110, protein: 3, carbs: 18, fats: 3, per: "1 medium (40g)" },
  { id: 10, name: "Chana (Boiled)", calories: 164, protein: 8.9, carbs: 27.4, fats: 2.6, per: "100g" },
  { id: 11, name: "Poha", calories: 130, protein: 2.6, carbs: 27, fats: 1.5, per: "100g" },
  { id: 12, name: "Idli", calories: 58, protein: 2, carbs: 12, fats: 0.4, per: "1 idli (40g)" },
  { id: 13, name: "Upma", calories: 131, protein: 3.5, carbs: 20, fats: 4, per: "100g" },
  { id: 14, name: "Rajma (Boiled)", calories: 127, protein: 8.7, carbs: 22.8, fats: 0.5, per: "100g" },
];


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
  { id: 1, name: "Grilled Chicken", calories: 165, protein: 31 },
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
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [loggedMeals, setLoggedMeals] = useState<any[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)
  const [showFoodDialog, setShowFoodDialog] = useState(false)
  const [foodDialogData, setFoodDialogData] = useState<FoodDialogData | null>(null)
  const [customFoodName, setCustomFoodName] = useState("")
  const [customFoodQuantity, setCustomFoodQuantity] = useState("")
  const [customFoodUnit, setCustomFoodUnit] = useState("g")
  const [showCustomFoodDialog, setShowCustomFoodDialog] = useState(false)
  const [geminiSuggestions, setGeminiSuggestions] = useState<any[]>([])
  const geminiTimeout = useRef<NodeJS.Timeout | null>(null)
  const [geminiLoading, setGeminiLoading] = useState(false)
  const [waterToday, setWaterToday] = useState(0)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [showShopItemsDialog, setShowShopItemsDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false)

  const filteredFoods = mockFoodDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate today's summary (add waterToday)
  const summary = loggedMeals.reduce(
    (acc, meal) => {
      meal.items.forEach((item: any) => {
        acc.calories += Number((item.calories || 0).toFixed(2))
        acc.protein += Number((item.protein || 0).toFixed(2))
        acc.carbs += Number((item.carbs || 0).toFixed(2))
        acc.fats += Number((item.fats || 0).toFixed(2))
      })
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  // Add water to summary object
  summary.water = waterToday
  // Smart Gemini-powered search (show suggestions even if local match is partial)
  useEffect(() => {
    if (searchQuery.trim()) {
      setGeminiLoading(true)
      if (geminiTimeout.current) clearTimeout(geminiTimeout.current)
      geminiTimeout.current = setTimeout(async () => {
        try {
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
        } catch (err) {
          setGeminiSuggestions([])
        }
        setGeminiLoading(false) // <-- always set loading to false
      }, 500)
    } else {
      setGeminiSuggestions([])
      setGeminiLoading(false)
    }
    return () => {
      if (geminiTimeout.current) clearTimeout(geminiTimeout.current)
    }
  }, [searchQuery])

  // New: handle photo upload and AI analysis only on 'Add' click
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handlePhotoAnalyze = async () => {
    if (!selectedImage) return
    setPhotoLoading(true)
    try {
      // Send to AI API for recognition
      const formData = new FormData()
      formData.append("image", selectedImage)
      const res = await fetch("/api/food-photo-ai", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data && data.nutrition && data.nutrition.food_name) {
        // Now get nutrition info from food name
        const nutritionRes = await fetch("/api/food-nutrition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodName: data.nutrition.food_name, quantity: 100, unit: "g" }),
        })
        const nutritionData = await nutritionRes.json()
        if (nutritionData && nutritionData.nutrition) {
          openFoodDialog({
            id: Date.now(),
            name: data.nutrition.food_name,
            calories: nutritionData.nutrition.calories,
            protein: nutritionData.nutrition.protein,
            carbs: nutritionData.nutrition.carbs,
            fats: nutritionData.nutrition.fats,
            per: nutritionData.nutrition.per || "100g",
          })
        } else {
          alert("Could not get nutrition info for detected food.")
        }
      } else {
        alert("Could not recognize food from photo.")
      }
    } catch (err) {
      alert("Error contacting AI service.")
    }
    setPhotoLoading(false)
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

  // Voice recording logic for new VoiceTab
  let recognitionRef = useRef<any>(null)

  const handleVoiceStart = () => {
    setIsListening(true)
    setIsVoiceLoading(false)
    // Use SpeechRecognition or webkitSpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.')
      setIsListening(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = async (event: any) => {
      setIsListening(false)
      setIsVoiceLoading(true)
      const transcript = event.results[0][0].transcript
      // Send transcript to AI nutrition API
      try {
        const res = await fetch('/api/food-nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foodName: transcript, quantity: 100, unit: 'g' }),
        })
        const data = await res.json()
        if (data && data.nutrition) {
          openFoodDialog({
            id: Date.now(),
            name: transcript,
            calories: data.nutrition.calories,
            protein: data.nutrition.protein,
            carbs: data.nutrition.carbs,
            fats: data.nutrition.fats,
            per: '100g',
          })
        } else {
          alert('Could not get nutrition info from voice input.')
        }
      } catch (err) {
        alert('Could not get nutrition info from voice input.')
      }
      setIsVoiceLoading(false)
    }
    recognition.onerror = () => {
      setIsListening(false)
      setIsVoiceLoading(false)
      alert('Voice recognition failed.')
    }
    recognition.start()
  }

  const handleVoiceStop = () => {
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const openFoodDialog = (food: FoodItem, customQuantity?: number) => {
    setFoodDialogData({
      food,
      quantity: customQuantity || 100, // Use custom quantity if provided
      mealType: "breakfast",
    })
    setShowFoodDialog(true)
  }

  // Save food log to Supabase
  const handleAddFood = async () => {
    if (foodDialogData && user) {
      const { food, quantity, mealType } = foodDialogData

      const istDate = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      const [day, month, year] = istDate.split(",")[0].split("/");
      const todayIST = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const today = todayIST;
    
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
        toast.success('Food logged successfully! 🍽️', {
          description: `Added ${quantity}${food.per.replace(/\d+/g, '')} of ${food.name}`,
          duration: 3000,
        })

        // IMPORTANT: Add streak update logic here
        await updateStreakAfterFoodLog();

        setShowFoodDialog(false)
        setFoodDialogData(null)
        
        // Refetch logs
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
              carbs: item.carbs ?? 0,
              fats: item.fats ?? 0,
              logId: item.id,
            })),
            totalCalories: data.filter((item) => item.meal_type === meal).reduce((sum, item) => sum + (item.calories || 0), 0),
            time: '',
          }))
          setLoggedMeals(meals)
        }
      } else {
        toast.error('Failed to log food', {
          description: 'Please try again',
        })
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
          // Show FoodDialog with Gemini nutrition result using ACTUAL quantity
          openFoodDialog({
            id: Date.now(),
            name: customFoodName,
            calories: data.nutrition.calories, // This should already be for the entered quantity
            protein: data.nutrition.protein,
            carbs: data.nutrition.carbs,
            fats: data.nutrition.fats,
            per: `${customFoodQuantity}${customFoodUnit}`,
          })
          
          // Set the quantity in dialog to the actual entered amount
          setFoodDialogData(prev => prev ? {
            ...prev,
            quantity: Number(customFoodQuantity) // Use the actual quantity entered
          } : null)
          
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

  // Handler for shop item submit
  const handleShopItemSubmit = (item: any) => {
    openFoodDialog({
      ...item,
      per: item.per || `${item.quantity}${item.unit}`,
    });
  };

  // Insert or update water log for today
  const addWater = async (amount: number) => {
    if (!user) return
     const istDate = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      const [day, month, year] = istDate.split(",")[0].split("/");
      const todayIST = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      console.log(todayIST);
      const today = todayIST;

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        toast.error('Failed to log water', {
          description: 'Please try again',
        })
        return
      }

      if (existing) {
        const { error } = await supabase
          .from('water_logs')
          .update({ amount: existing.amount + amount })
          .eq('id', existing.id)

        if (!error) {
          toast.success('Water logged successfully! 💧', {
            description: `Added ${amount}ml of water`,
            duration: 3000,
          })
          fetchWaterToday()
        }
      } else {
        const { error } = await supabase.from('water_logs').insert({
          user_id: user.id,
          date: today,
          amount,
        })
        if (!error) {
          toast.success('Water logged successfully! 💧', {
            description: `Added ${amount}ml of water`,
            duration: 3000,
          })
          fetchWaterToday()
        }
      }
    } catch (error) {
      toast.error('Failed to log water', {
        description: 'Please try again',
      })
    }
  }

  // Fetch today's water total
  const fetchWaterToday = async () => {
    if (!user) return
          const istDate = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      const [day, month, year] = istDate.split(",")[0].split("/");
      const todayIST = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      console.log(todayIST);
      const today = todayIST;
    const { data } = await supabase
      .from('water_logs')
      .select('amount')
      .eq('user_id', user.id)
      .eq('date', today)
    if (data) {
      const total = data.reduce((sum, row) => sum + (row.amount || 0), 0)
      setWaterToday(total)
    }
  }

  // Delete food log from Supabase
  const deleteMealItem = (mealId: number, itemIndex: number, logId?: string): void => {
    (async () => {
      if (!logId) return
      const { error } = await supabase.from('food_logs').delete().eq('id', logId)

      if (error) {
        toast.error('Failed to delete food item', {
          description: 'Please try again',
        })
      } else {
        toast.success('Food item deleted! 🗑️', {
          duration: 2000,
        })
        // Refetch logs
        if (user) {
                const istDate = new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            });
            const [day, month, year] = istDate.split(",")[0].split("/");
            const todayIST = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            console.log(todayIST);
            const today = todayIST;
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
                carbs: item.carbs ?? 0,   // <-- add this line
                fats: item.fats ?? 0,     // <-- add this line
                logId: item.id,
              })),
              totalCalories: data.filter((item) => item.meal_type === meal).reduce((sum, item) => sum + (item.calories || 0), 0),
              time: '',
            }))
            setLoggedMeals(meals)
          }
        }
      }
    })();
  }

  const fetchTodaysMeals = async () => {
    if (!user) return
          const istDate = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          const [day, month, year] = istDate.split(",")[0].split("/");
          const todayIST = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          console.log(todayIST);
          const today = todayIST;
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
          carbs: item.carbs ?? 0,   // <-- add this line
          fats: item.fats ?? 0,     // <-- add this line
          logId: item.id,
        })),
        totalCalories: data.filter((item) => item.meal_type === meal).reduce((sum, item) => sum + (item.calories || 0), 0),
        time: '',
      }))
      setLoggedMeals(meals)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTodaysMeals()
      fetchWaterToday()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // When food dialog closes or food is added, clear selected image
  const handleFoodDialogOpenChange = (open: boolean) => {
    setShowFoodDialog(open)
    if (!open) {
      setSelectedImage(null)
    }
  }

  // Check for authentication and profile
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
        <div className="px-4 py-12 max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Smart Food Logging</h1>
            <p className="text-xl text-gray-600">Track your nutrition journey with advanced AI features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Recognition */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Camera className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Photo Recognition</h3>
                </div>
                <p className="text-gray-600">Take a photo of your food and let AI identify and calculate nutrition info instantly</p>
              </CardContent>
            </Card>

            {/* Voice Commands */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mic className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Voice Commands</h3>
                </div>
                <p className="text-gray-600">Simply speak what you ate and get instant nutrition breakdown</p>
              </CardContent>
            </Card>

            {/* Barcode Scanner */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Barcode className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Barcode Scanner</h3>
                </div>
                <p className="text-gray-600">Scan product barcodes for quick and accurate nutrition data</p>
              </CardContent>
            </Card>

            {/* Indian Food Database */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Indian Food Database</h3>
                </div>
                <p className="text-gray-600">Extensive database including local and street food options</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-6">
            <Button 
              onClick={() => router.push('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg shadow-lg"
            >
              Sign In to Get Started
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              Track your nutrition journey with our advanced features
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Add helper function INSIDE the component
  const formatDateForDB = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add streak update function INSIDE the component
  const updateStreakAfterFoodLog = async () => {
    if (!user) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const todayStr = formatDateForDB(today);
    const yesterdayStr = formatDateForDB(yesterday);

    // Get existing streak data
    const { data: streakData } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Check if user logged food yesterday
    const { data: yesterdayLogs } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", yesterdayStr);

    const hasLoggedYesterday = (yesterdayLogs || []).length > 0;

    let newCurrentStreak = 1;
    let newLastActiveStreak = 1;
    let newMaxStreak = 1;

    if (streakData) {
      const lastUpdateDate = new Date(streakData.updated_at);
      const lastUpdateStr = formatDateForDB(lastUpdateDate);
      
      // Check if this is the first log today
      if (lastUpdateStr !== todayStr) {
        // New day with logging
        if (hasLoggedYesterday || streakData.current_streak === 0) {
          // Continue or start streak
          newCurrentStreak = streakData.current_streak + 1;
        } else {
          // Streak broken, start fresh
          newCurrentStreak = 1;
        }
        newLastActiveStreak = newCurrentStreak;
        newMaxStreak = Math.max(newCurrentStreak, streakData.max_streak);

        // Update database
        await supabase.from("user_streaks").upsert({
          user_id: user.id,
          current_streak: newCurrentStreak,
          last_active_streak: newLastActiveStreak,
          max_streak: newMaxStreak,
          updated_at: new Date().toISOString()
        });

        // Show achievement toasts
        if (newCurrentStreak === 1 && streakData.current_streak === 0) {
          toast.success('🎯 Streak started!', {
            description: "Great job logging your first meal today!"
          });
        } else if (newCurrentStreak === 3) {
          toast.success('🔥 3 day streak!', {
            description: "You're on fire! Keep it up!"
          });
        } else if (newCurrentStreak === 7) {
          toast.success('⚔️ Weekly warrior!', {
            description: "Amazing! You've logged for a full week!"
          });
        }
      }
    } else {
      // First time logging
      await supabase.from("user_streaks").insert({
        user_id: user.id,
        current_streak: 1,
        last_active_streak: 1,
        max_streak: 1,
        updated_at: new Date().toISOString()
      });

      toast.success('🎯 Streak started!', {
        description: "Great job logging your first meal today!"
      });
    }

    // IMPORTANT: Check for "First Food Log" achievement
    const { data: firstLogAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .eq('achievement_name', 'First Food Log')
      .single();

    if (!firstLogAchievement) {
      // User hasn't earned "First Food Log" achievement yet - award it now
      try {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_name: 'First Food Log',
            achievement_icon: '🍽️',
            earned_at: new Date().toISOString()
          });

        if (!error) {
          toast.success('🏆 Achievement Unlocked: First Food Log!', {
            description: 'Congratulations on logging your first meal!',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error awarding First Food Log achievement:', error);
      }
    }

    // Check for streak achievements
    if (newCurrentStreak === 3) {
      const { data: streakAchievement } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_name', '3 Day Streak')
        .single();

      if (!streakAchievement) {
        await supabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_name: '3 Day Streak',
          achievement_icon: '🔥',
          earned_at: new Date().toISOString()
        });

        toast.success('🏆 Achievement Unlocked: 3 Day Streak!', {
          description: 'Amazing consistency! Keep it up!',
          duration: 5000,
        });
      }
    }

    if (newCurrentStreak === 7) {
      const { data: weeklyAchievement } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_name', 'Weekly Warrior')
        .single();

      if (!weeklyAchievement) {
        await supabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_name: 'Weekly Warrior',
          achievement_icon: '⚔️',
          earned_at: new Date().toISOString()
        });

        toast.success('🏆 Achievement Unlocked: Weekly Warrior!', {
          description: 'One week of consistent logging!',
          duration: 5000,
        });
      }
    }
  };

  return (
    <>
        {/* Add Toaster component at root */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
              color: '#374151',
              border: '1px solid #E5E7EB',
            },
            className: 'shadow-lg',
          }}
        />

        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
          <div className="px-4 py-6 space-y-6">
            {/* Summary Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-100 to-blue-100">
              <CardContent className="p-2 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:justify-between gap-2 sm:gap-4">
                  {/* Calories */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/50 backdrop-blur-sm">
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mb-0.5 sm:mb-1" />
                    <span className="font-bold text-base sm:text-lg text-gray-900 tabular-nums">
                      {summary.calories.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-600">Calories</span>
                  </div>

                  {/* Protein */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/50 backdrop-blur-sm">
                    <Drumstick className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mb-0.5 sm:mb-1" />
                    <span className="font-bold text-base sm:text-lg text-gray-900 tabular-nums">
                      {summary.protein.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-600">Protein</span>
                  </div>

                  {/* Carbs */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/50 backdrop-blur-sm">
                    <Sandwich className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mb-0.5 sm:mb-1" />
                    <span className="font-bold text-base sm:text-lg text-gray-900 tabular-nums">
                      {summary.carbs.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-600">Carbs</span>
                  </div>

                  {/* Fats */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/50 backdrop-blur-sm">
                    <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-0.5 sm:mb-1" />
                    <span className="font-bold text-base sm:text-lg text-gray-900 tabular-nums">
                      {summary.fats.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-600">Fats</span>
                  </div>

                  {/* Water */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/50 backdrop-blur-sm col-span-2 sm:col-span-1">
                    <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 mb-0.5 sm:mb-1" />
                    <span className="font-bold text-base sm:text-lg text-gray-900 tabular-nums">
                      {waterToday.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-600">Water</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Header */}
            <FoodLoggingHeader />

            {/* Quick Popular Foods */}
            {/* <PopularFoods
              popularFoods={popularFoods}
              onFoodSelect={(food) => openFoodDialog({
                ...food,
                per: food.per || "100g", // Ensure 'per' is always present
                carbs: food.carbs ?? 0,
                fats: food.fats ?? 0,
              })}
            /> */}
            {/* Shop/Street Food Add Button */}
            <ShopFoodCard onShopFoodClick={() => setShowShopItemsDialog(true)} />
            <ShopItemsDialog
              open={showShopItemsDialog}
              onOpenChange={setShowShopItemsDialog}
              onSubmit={handleShopItemSubmit}
            />

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
                <PhotoTab
                  selectedImage={selectedImage}
                  onImageUpload={handleImageUpload}
                  onAddPhoto={handlePhotoAnalyze}
                  loading={photoLoading}
                />
              </TabsContent>

              {/* Barcode Tab */}
              <TabsContent value="barcode">
                <BarcodeTab onFoodSelect={openFoodDialog} />
              </TabsContent>

              {/* Voice Tab */}
              <TabsContent value="voice">
                <VoiceTab
                  isListening={isListening}
                  isLoading={isVoiceLoading}
                  onStart={handleVoiceStart}
                  onStop={handleVoiceStop}
                />
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
              onOpenChange={handleFoodDialogOpenChange}
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

            {/* Feedback Button and Form */}
            <FeedbackButton onClick={() => setShowFeedback(true)} />
            <FeedbackForm
              open={showFeedback}
              onOpenChange={setShowFeedback}
              userEmail={user?.email || ''}
              userName={user?.user_metadata?.full_name || 'Anonymous'}
              userId={user?.id}
            />
          </div>
        </div>
    </>
  )
}
