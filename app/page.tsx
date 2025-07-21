"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  DashboardHeader,
  QuickStats,
  ProgressCard,
  WeeklyChart,
  RecentMeals,
  Achievements,
  WeeklyGoals,
} from "@/components/dashboard"
import { GoogleSignInButton, UserProfile } from "@/components/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Award } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Mock data for dashboard
const mockUserData = {
  name: "Alex Johnson",
  dailyGoals: {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fats: 80,
    water: 3000,
  },
  dailyIntake: {
    calories: 1850,
    protein: 125,
    carbs: 180,
    fats: 65,
    water: 2250,
  },
  streak: 12,
  weeklyGoalsMet: 5,
}

const weeklyData = [
  { day: "Mon", calories: 2100, protein: 140, water: 2800 },
  { day: "Tue", calories: 1950, protein: 135, water: 3200 },
  { day: "Wed", calories: 2250, protein: 155, water: 2900 },
  { day: "Thu", calories: 2050, protein: 145, water: 3100 },
  { day: "Fri", calories: 1900, protein: 130, water: 2700 },
  { day: "Sat", calories: 2300, protein: 160, water: 3300 },
  { day: "Sun", calories: 1850, protein: 125, water: 2250 },
]

const recentMeals = [
  { name: "Greek Yogurt Bowl", calories: 180, time: "8:30 AM", type: "breakfast" },
  { name: "Chicken Salad", calories: 420, time: "12:45 PM", type: "lunch" },
  { name: "Protein Smoothie", calories: 280, time: "3:15 PM", type: "snack" },
]

const achievements = [
  { name: "7-Day Streak", icon: "🔥", earned: true, progress: 100 },
  { name: "Protein Goal", icon: "💪", earned: true, progress: 100 },
  { name: "Hydration Hero", icon: "💧", earned: false, progress: 75 },
  { name: "Weekly Goals", icon: "🎯", earned: false, progress: 71 },
]

const nutritionStats = {
  avgCalories: 2050,
  avgProtein: 142,
  avgWater: 2900,
  bestStreak: 23,
  totalMeals: 156,
  weeklyGoals: 5,
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [foodLogs, setFoodLogs] = useState<any[]>([])
  const [waterLogs, setWaterLogs] = useState<any[]>([])
  const [stats, setStats] = useState({ totalMeals: 0, avgCalories: 0, bestStreak: 0 })
  const [dailyGoals, setDailyGoals] = useState<any>(null)
  const [dailyIntake, setDailyIntake] = useState<any>(null)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [recentMeals, setRecentMeals] = useState<any[]>([])
  const [weeklyGoalsMet, setWeeklyGoalsMet] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [realAchievements, setRealAchievements] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
      setProfile(profileData)
      // Set daily goals from profile
      setDailyGoals(profileData ? {
        calories: profileData.daily_calorie_goal,
        protein: profileData.daily_protein_goal,
        carbs: profileData.daily_carbs_goal,
        fats: profileData.daily_fats_goal,
        water: profileData.daily_water_goal,
      } : null)
      // Fetch food logs for last 7 days
      const today = new Date()
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 6)
      const todayStr = today.toISOString().slice(0, 10)
      const weekAgoStr = weekAgo.toISOString().slice(0, 10)
      const { data: logs } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", weekAgoStr)
        .lte("date", todayStr)
      setFoodLogs(logs || [])
      // Fetch water logs for last 7 days
      const { data: water } = await supabase
        .from("water_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", weekAgoStr)
        .lte("date", todayStr)
      setWaterLogs(water || [])
      // Aggregate quick stats
      const totalMeals = logs ? logs.length : 0
      const avgCalories = logs && logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + (l.calories || 0), 0) / logs.length) : 0
      setStats({ totalMeals, avgCalories, bestStreak: 0 }) // bestStreak dummy for now
      // Aggregate daily intake for today
      const todayLogs = (logs || []).filter(l => l.date === todayStr)
      const dailyIntakeObj = {
        calories: todayLogs.reduce((sum, l) => sum + (l.calories || 0), 0),
        protein: todayLogs.reduce((sum, l) => sum + (l.protein || 0), 0),
        carbs: todayLogs.reduce((sum, l) => sum + (l.carbs || 0), 0),
        fats: todayLogs.reduce((sum, l) => sum + (l.fats || 0), 0),
        water: (water || []).filter(w => w.date === todayStr).reduce((sum, w) => sum + (w.amount || 0), 0),
      }
      setDailyIntake(dailyIntakeObj)
      // Weekly chart data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekAgo)
        d.setDate(weekAgo.getDate() + i)
        return d.toISOString().slice(0, 10)
      })
      const weeklyChart = weekDates.map((date, idx) => {
        const dayLogs = (logs || []).filter(l => l.date === date)
        const dayWater = (water || []).filter(w => w.date === date)
        return {
          day: days[idx],
          calories: dayLogs.reduce((sum, l) => sum + (l.calories || 0), 0),
          protein: dayLogs.reduce((sum, l) => sum + (l.protein || 0), 0),
          water: dayWater.reduce((sum, w) => sum + (w.amount || 0), 0),
        }
      })
      setWeeklyData(weeklyChart)
      // Recent meals (last 3 logs)
      const sortedLogs = [...(logs || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setRecentMeals(sortedLogs.slice(0, 3).map(l => ({
        name: l.food_name,
        calories: l.calories,
        time: l.created_at ? new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        type: l.meal_type,
      })))
      // Weekly goals met (dummy: count days with calories >= 80% of goal)
      let met = 0
      if (profileData && profileData.daily_calorie_goal) {
        for (let i = 0; i < 7; i++) {
          const date = weekDates[i]
          const dayLogs = (logs || []).filter(l => l.date === date)
          const dayCalories = dayLogs.reduce((sum, l) => sum + (l.calories || 0), 0)
          if (dayCalories >= 0.8 * profileData.daily_calorie_goal) met++
        }
      }
      setWeeklyGoalsMet(met)
      // --- Streak and Max Streak Calculation ---
      // Get all unique dates with at least one meal
      const allDates = Array.from(new Set((logs || []).map(l => l.date))).sort()
      // Convert to Date objects
      const dateObjs = allDates.map(d => new Date(d))
      // Sort ascending
      dateObjs.sort((a, b) => a.getTime() - b.getTime())
      let currentStreak = 0
      let maxStreakVal = 0
      let prev: Date | null = null
      for (let d of dateObjs) {
        if (!prev) {
          currentStreak = 1
        } else {
          const diff = (d.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
          if (diff === 1) {
            currentStreak++
          } else if (diff > 1) {
            currentStreak = 1
          }
        }
        if (currentStreak > maxStreakVal) maxStreakVal = currentStreak
        prev = d
      }
      // If last log is today, show current streak, else 0
      const hasToday = allDates.includes(todayStr)
      setStreak(hasToday ? currentStreak : 0)
      setMaxStreak(maxStreakVal)
      // --- Achievements Calculation ---
      const achievementsArr = []
      // 7-day streak
      if (maxStreakVal >= 7) achievementsArr.push({ name: "7-Day Streak", icon: "🔥", earned: true, progress: 100 })
      else achievementsArr.push({ name: "7-Day Streak", icon: "🔥", earned: false, progress: Math.round((maxStreakVal / 7) * 100) })
      // 30 meals logged
      if (totalMeals >= 30) achievementsArr.push({ name: "30 Meals Logged", icon: "🍽️", earned: true, progress: 100 })
      else achievementsArr.push({ name: "30 Meals Logged", icon: "🍽️", earned: false, progress: Math.round((totalMeals / 30) * 100) })
      // 7 days hitting calorie goal
      let calorieGoalDays = 0
      if (profileData && profileData.daily_calorie_goal) {
        for (let i = 0; i < 7; i++) {
          const date = weekDates[i]
          const dayLogs = (logs || []).filter(l => l.date === date)
          const dayCalories = dayLogs.reduce((sum, l) => sum + (l.calories || 0), 0)
          if (dayCalories >= profileData.daily_calorie_goal) calorieGoalDays++
        }
      }
      if (calorieGoalDays >= 7) achievementsArr.push({ name: "7 Days Calorie Goal", icon: "🏆", earned: true, progress: 100 })
      else achievementsArr.push({ name: "7 Days Calorie Goal", icon: "🏆", earned: false, progress: Math.round((calorieGoalDays / 7) * 100) })
      // 3 days with 2L+ water
      let water2Ldays = 0
      for (let i = 0; i < 7; i++) {
        const date = weekDates[i]
        const dayWater = (water || []).filter(w => w.date === date)
        const totalWater = dayWater.reduce((sum, w) => sum + (w.amount || 0), 0)
        if (totalWater >= 2000) water2Ldays++
      }
      if (water2Ldays >= 3) achievementsArr.push({ name: "3 Days 2L+ Water", icon: "💧", earned: true, progress: 100 })
      else achievementsArr.push({ name: "3 Days 2L+ Water", icon: "💧", earned: false, progress: Math.round((water2Ldays / 3) * 100) })
      setRealAchievements(achievementsArr)
      // Persist streaks
      await supabase.from("user_streaks").upsert({
        user_id: user.id,
        current_streak: hasToday ? currentStreak : 0,
        max_streak: maxStreakVal,
        updated_at: new Date().toISOString(),
      }, { onConflict: ["user_id"] })
      // Persist earned achievements
      for (const ach of achievementsArr) {
        if (ach.earned) {
          await supabase.from("user_achievements").upsert({
            user_id: user.id,
            achievement_name: ach.name,
            achievement_icon: ach.icon,
            earned_at: new Date().toISOString(),
          }, { onConflict: ["user_id", "achievement_name"] })
        }
      }
    }
    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
        <div className="px-4 py-6 space-y-6">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to FitNutrition</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Track your nutrition, plan meals, and achieve your fitness goals with AI-powered insights
            </p>
          </div>

          {/* Sign In Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-lg text-gray-900">Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleSignInButton />
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Nutrition Tracking</h3>
                    <p className="text-sm text-gray-600">Log meals with AI-powered food recognition</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Progress Analytics</h3>
                    <p className="text-sm text-gray-600">Track your fitness journey with detailed insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Achievement System</h3>
                    <p className="text-sm text-gray-600">Earn badges and stay motivated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // User is logged in - show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header with Streak */}
        <DashboardHeader name={profile?.full_name || user.user_metadata?.full_name || user.email} streak={streak} maxStreak={maxStreak} />

        {/* Quick Stats Cards */}
        <QuickStats
          totalMeals={stats.totalMeals}
          avgCalories={stats.avgCalories}
          bestStreak={stats.bestStreak}
        />

        {/* Today's Progress */}
        {dailyGoals && dailyIntake && (
          <ProgressCard dailyGoals={dailyGoals} dailyIntake={dailyIntake} hideWaterAdd />
        )}

        {/* Weekly Chart */}
        {weeklyData && weeklyData.length > 0 ? (
          <WeeklyChart weeklyData={weeklyData} avgCalories={stats.avgCalories} />
        ) : (
          <div className="text-center text-gray-400 py-8">No weekly data to display yet.</div>
        )}

        {/* Recent Meals */}
        <RecentMeals recentMeals={recentMeals} />

        {/* Achievements Progress (dummy) */}
        <Achievements achievements={realAchievements} />

        {/* Weekly Goals Summary */}
        <WeeklyGoals weeklyGoalsMet={weeklyGoalsMet} />
      </div>
    </div>
  )
}
