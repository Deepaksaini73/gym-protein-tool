"use client"

import {
  ProgressHeader,
  KeyStats,
  WeightProgress,
  RecentWeighIns,
  Achievements,
  WeeklySummary,
} from "@/components/progress"

// Mock user data
const mockUserData = {
  name: "Alex Johnson",
  currentWeight: 75,
  targetWeight: 80,
  streak: 12,
  weeklyGoalsMet: 5,
}

const mockWeightHistory = [
  { date: "2024-01-15", weight: 73 },
  { date: "2024-01-22", weight: 73.5 },
  { date: "2024-01-29", weight: 74 },
  { date: "2024-02-05", weight: 74.2 },
  { date: "2024-02-12", weight: 74.8 },
  { date: "2024-02-19", weight: 75 },
  { date: "2024-02-26", weight: 75.3 },
]

const achievements = [
  { name: "7-Day Streak", icon: "🔥", earned: true },
  { name: "Protein Goal", icon: "💪", earned: true },
  { name: "Hydration Hero", icon: "💧", earned: false },
  { name: "Meal Prep Master", icon: "🍱", earned: true },
  { name: "Consistency King", icon: "👑", earned: false },
  { name: "Weight Goal", icon: "⚖️", earned: false },
]

const mockStats = {
  totalMealsLogged: 156,
  averageCalories: 2180,
  longestStreak: 23,
  totalWorkouts: 45,
}

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <ProgressHeader />

        {/* Key Stats */}
        <KeyStats streak={mockUserData.streak} totalMealsLogged={mockStats.totalMealsLogged} />

        {/* Weight Progress */}
        <WeightProgress
          weightHistory={mockWeightHistory}
          currentWeight={mockUserData.currentWeight}
          targetWeight={mockUserData.targetWeight}
        />

        {/* Recent Weigh-ins */}
        <RecentWeighIns weightHistory={mockWeightHistory} />

        {/* Achievements */}
        <Achievements achievements={achievements} />

        {/* Weekly Summary */}
        <WeeklySummary
          weeklyGoalsMet={mockUserData.weeklyGoalsMet}
          averageCalories={mockStats.averageCalories}
          totalWorkouts={mockStats.totalWorkouts}
        />
      </div>
    </div>
  )
}
