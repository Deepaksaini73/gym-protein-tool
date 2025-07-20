"use client"

import { useState } from "react"
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
        <DashboardHeader name={user.user_metadata?.full_name || mockUserData.name} streak={mockUserData.streak} />

        {/* Quick Stats Cards */}
        <QuickStats
          totalMeals={nutritionStats.totalMeals}
          avgCalories={nutritionStats.avgCalories}
          bestStreak={nutritionStats.bestStreak}
        />

        {/* Today's Progress */}
        <ProgressCard dailyGoals={mockUserData.dailyGoals} dailyIntake={mockUserData.dailyIntake} />

        {/* Weekly Chart */}
        <WeeklyChart weeklyData={weeklyData} avgCalories={nutritionStats.avgCalories} />

        {/* Recent Meals */}
        <RecentMeals recentMeals={recentMeals} />

        {/* Achievements Progress */}
        <Achievements achievements={achievements} />

        {/* Weekly Goals Summary */}
        <WeeklyGoals weeklyGoalsMet={mockUserData.weeklyGoalsMet} />
      </div>
    </div>
  )
}
