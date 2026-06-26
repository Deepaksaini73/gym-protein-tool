"use client"

import { useState, useEffect } from "react"
// remove: import { useAuth } from "@/contexts/auth-context"
import { NutritionGoals } from "@/components/profile/nutrition-goals"
import {
  ProfileHeader,
  QuickStats,
  PersonalInfo,
  FitnessGoals,
  Achievements,
  AccountInfo,
  ProfileSetup,
  HealthMetrics,
} from "@/components/profile"
import { UserProfile } from "@/components/auth"
// remove auth/supabase database loaders if not needed for demo mode
import { toast } from "sonner"
import { FeedbackButton } from "@/components/shared/feedback-button"
import { FeedbackForm } from "@/components/shared/feedback-form"

const DEMO_USER = {
  id: "demo-user",
  email: "demo@fitness.com",
  user_metadata: { full_name: "Demo User" },
}

const DEMO_PROFILE = {
  full_name: "Demo User",
  email: "demo@fitness.com",
  age: 28,
  gender: "other" as const,
  height: 170,
  current_weight: 70,
  fitness_goal: "maintenance" as const,
  target_weight: 70,
  activity_level: "moderately_active" as const,
  daily_calorie_goal: 2000,
  daily_water_goal: 2500,
  daily_protein_goal: 120,
  daily_carbs_goal: 250,
  daily_fats_goal: 70,
  bmi: 24.2,
  total_meals_logged: 42,
  created_at: new Date().toISOString(),
}

export default function ProfilePage() {
  // replace auth user with demo user
  const user = DEMO_USER
  const authLoading = false

  const [profile, setProfile] = useState<any>(DEMO_PROFILE)
  const [editProfile, setEditProfile] = useState<any>(DEMO_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [streakData, setStreakData] = useState<any>({ max_streak: 7 })
  const [userAchievements, setUserAchievements] = useState<any[]>([
    { achievement_name: "First Week", achievement_icon: "🎯", earned_at: new Date().toISOString() },
    { achievement_name: "Protein Champion", achievement_icon: "💪", earned_at: new Date().toISOString() },
  ])
  const [isStatsLoading, setIsStatsLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    setProfile(DEMO_PROFILE)
    setEditProfile(DEMO_PROFILE)
    setShowSetup(false)
    setIsLoading(false)
    setIsStatsLoading(false)
  }, [])

  // remove these auth gates entirely:
  // if (authLoading || isLoading) ...
  // if (!user) ...
  // if (!profile && !showSetup) ...
  // if (showSetup) ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Optional: keep this only if it does not force auth UI */}
        {/* <UserProfile /> */}

        <div className="space-y-6">
          <ProfileHeader
            isEditing={isEditing}
            onEdit={() => {
              setIsEditing(true)
              setEditProfile(profile)
            }}
            onSave={() => {
              setProfile(editProfile)
              setIsEditing(false)
              toast.success("Profile updated successfully!")
            }}
          />

          <HealthMetrics profile={profile} />

          <QuickStats
            bmi={profile.bmi.toString()}
            longestStreak={streakData?.max_streak || 0}
            totalMealsLogged={profile.total_meals_logged || 0}
            isLoading={isStatsLoading}
          />

          <PersonalInfo
            profile={{
              name: editProfile.full_name,
              email: editProfile.email,
              age: editProfile.age,
              gender: editProfile.gender,
              height: editProfile.height,
              currentWeight: editProfile.current_weight,
            }}
            isEditing={isEditing}
            onProfileChange={(newProfile) => {
              setEditProfile({
                ...editProfile,
                full_name: newProfile.name,
                email: newProfile.email,
                age: newProfile.age,
                gender: newProfile.gender,
                height: newProfile.height,
                current_weight: newProfile.currentWeight,
              })
            }}
          />

          <FitnessGoals
            goals={{
              fitnessGoal: editProfile.fitness_goal,
              targetWeight: editProfile.target_weight,
              activityLevel: editProfile.activity_level,
            }}
            isEditing={isEditing}
            onGoalsChange={(newGoals) => {
              setEditProfile({
                ...editProfile,
                fitness_goal: newGoals.fitnessGoal,
                target_weight: newGoals.targetWeight,
                activity_level: newGoals.activityLevel,
              })
            }}
          />

          <NutritionGoals
            goals={{
              daily_calorie_goal: editProfile.daily_calorie_goal,
              daily_water_goal: editProfile.daily_water_goal,
              daily_protein_goal: editProfile.daily_protein_goal,
              daily_carbs_goal: editProfile.daily_carbs_goal,
              daily_fats_goal: editProfile.daily_fats_goal,
            }}
            isEditing={isEditing}
            onGoalsChange={(newGoals) => setEditProfile({ ...editProfile, ...newGoals })}
          />

          <Achievements
            achievements={userAchievements.map((achievement) => ({
              name: achievement.achievement_name,
              icon: achievement.achievement_icon,
              earned: true,
              earnedAt: achievement.earned_at,
            }))}
            isLoading={isStatsLoading}
          />

          <AccountInfo joinDate={profile.created_at} />
        </div>
      </div>

      <FeedbackButton onClick={() => setShowFeedback(true)} />
      <FeedbackForm
        open={showFeedback}
        onOpenChange={setShowFeedback}
        userEmail={user.email}
        userName={user.user_metadata.full_name}
        userId={user.id}
      />
    </div>
  )
}
