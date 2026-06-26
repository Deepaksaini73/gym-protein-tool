"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Award } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { ProgressCard } from "@/components/dashboard/progress-card"
import { RecentMeals } from "@/components/dashboard/recent-meals"
import { WeeklyOverview } from "@/components/dashboard/WeeklyOverview"
import { Achievements } from "@/components/dashboard/achievements"
import { WeeklyGoals } from "@/components/dashboard/weekly-goals"
import { FeedbackButton } from "@/components/shared/feedback-button"
import { FeedbackForm } from "@/components/shared/feedback-form"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  // Demo mode: no auth, no Supabase login
  const DEMO_MODE = true

  const router = useRouter()
  const isMounted = useRef(false)

  const demoUser = {
    id: "demo-user",
    email: "demo@fitnutrition.com",
    user_metadata: {
      full_name: "Demo User",
    },
  }

  const user = DEMO_MODE ? (demoUser as any) : null
  const loading = false

  const [profile, setProfile] = useState<any>({
    full_name: "Demo User",
    daily_calorie_goal: 2200,
    daily_protein_goal: 120,
    daily_carbs_goal: 250,
    daily_fats_goal: 70,
    daily_water_goal: 2500,
  })

  const [foodLogs, setFoodLogs] = useState<any[]>([])
  const [waterLogs, setWaterLogs] = useState<any[]>([])
  const [stats, setStats] = useState({ totalMeals: 4, avgCalories: 420, bestStreak: 7 })
  const [dailyGoals, setDailyGoals] = useState<any>({
    calories: 2200,
    protein: 120,
    carbs: 250,
    fats: 70,
    water: 2500,
  })
  const [dailyIntake, setDailyIntake] = useState<any>({
    calories: 1680,
    protein: 96,
    carbs: 182,
    fats: 54,
    water: 1800,
  })
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [recentMeals, setRecentMeals] = useState<any[]>([
    { id: 1, name: "Grilled Chicken Breast", calories: 165, protein: 31, time: "8:30 AM", date: "2026-06-26" },
    { id: 2, name: "Brown Rice", calories: 112, protein: 2.6, time: "1:00 PM", date: "2026-06-26" },
    { id: 3, name: "Banana", calories: 89, protein: 1.1, time: "4:00 PM", date: "2026-06-26" },
  ])
  const [weeklyGoalsMet, setWeeklyGoalsMet] = useState(4)
  const [streak, setStreak] = useState(7)
  const [maxStreak, setMaxStreak] = useState(12)
  const [streakActive, setStreakActive] = useState(true)
  const [realAchievements, setRealAchievements] = useState<any[]>([
    { name: "First Food Log", icon: "🍽️", description: "Log your first meal", earned: true, earnedAt: new Date().toISOString() },
    { name: "3 Day Streak", icon: "🔥", description: "Maintain a 3 day logging streak", earned: true, earnedAt: new Date().toISOString() },
    { name: "Weekly Warrior", icon: "⚔️", description: "Maintain a 7 day logging streak", earned: true, earnedAt: new Date().toISOString() },
  ])
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [weekOverview, setWeekOverview] = useState<any[]>([
    { date: "2026-06-20", day: "Sat", calories: 1800, protein: 90, carbs: 200, fats: 60, water: 2000 },
    { date: "2026-06-21", day: "Sun", calories: 2100, protein: 110, carbs: 230, fats: 65, water: 2300 },
    { date: "2026-06-22", day: "Mon", calories: 1900, protein: 100, carbs: 210, fats: 58, water: 2100 },
    { date: "2026-06-23", day: "Tue", calories: 2200, protein: 120, carbs: 250, fats: 70, water: 2500 },
    { date: "2026-06-24", day: "Wed", calories: 1750, protein: 85, carbs: 180, fats: 55, water: 1900 },
    { date: "2026-06-25", day: "Thu", calories: 2050, protein: 105, carbs: 220, fats: 62, water: 2400 },
    { date: "2026-06-26", day: "Fri", calories: 1680, protein: 96, carbs: 182, fats: 54, water: 1800 },
  ])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastActiveStreak, setLastActiveStreak] = useState(7)
  const [displayStreak, setDisplayStreak] = useState(7)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [needsProfile, setNeedsProfile] = useState(false)

  const refreshDashboard = useCallback(() => {
    if (isMounted.current) setRefreshTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    isMounted.current = true

    // Demo data only — no auth, no Supabase login
    setIsDataLoading(false)

    return () => {
      isMounted.current = false
    }
  }, [])

  if (loading) {
    return null
  }

  // Removed login gate entirely — always show dashboard for frontend review
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "white",
            color: "#374151",
            border: "1px solid #E5E7EB",
          },
          className: "shadow-lg",
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
        <div className="px-4 py-6 space-y-6">
          <DashboardHeader
            name={profile?.full_name || user.user_metadata?.full_name || user.email}
            streak={displayStreak}
            maxStreak={maxStreak}
            streakActive={streakActive}
          />

          <QuickStats
            totalMeals={stats.totalMeals}
            avgCalories={stats.avgCalories}
            bestStreak={maxStreak}
          />

          {dailyGoals && dailyIntake && (
            <ProgressCard dailyGoals={dailyGoals} dailyIntake={dailyIntake} hideWaterAdd />
          )}

          <RecentMeals recentMeals={recentMeals} />
          <WeeklyOverview days={weekOverview} isLoading={isDataLoading} />
          <Achievements achievements={realAchievements} />
          <WeeklyGoals weeklyGoalsMet={weeklyGoalsMet} />

          <FeedbackButton onClick={() => setShowFeedback(true)} />
          <FeedbackForm
            open={showFeedback}
            onOpenChange={setShowFeedback}
            userEmail={user?.email || ""}
            userName={user?.user_metadata?.full_name || "Demo User"}
            userId={user?.id}
          />
        </div>
      </div>
    </>
  )
}
