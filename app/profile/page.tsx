"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from '@/lib/supabase'
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
import { getUserProfile, createUserProfile, updateUserProfile, 
         getUserStreaks, getUserAchievements } from "@/lib/database"
import { toast } from "sonner"
import { FeedbackButton } from "@/components/shared/feedback-button"
import { FeedbackForm } from "@/components/shared/feedback-form"

const AVAILABLE_ACHIEVEMENTS = [
  { name: "First Week", icon: "🎯", id: "first_week" },
  { name: "Protein Champion", icon: "💪", id: "protein_champ" },
  { name: "Hydration Hero", icon: "💧", id: "hydration_hero" },
  { name: "Meal Prep Master", icon: "🍱", id: "meal_master" },
]

// Add type for profile update
type ProfileUpdateData = {
  full_name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  current_weight: number
  fitness_goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'endurance'
  target_weight: number
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  daily_calorie_goal: number
  daily_water_goal: number
  daily_protein_goal: number
  daily_carbs_goal: number
  daily_fats_goal: number
}

export default function ProfilePage() {
  // 1. Auth context hook
  const { user, loading: authLoading } = useAuth()

  // 2. All useState hooks grouped together
  const [profile, setProfile] = useState<UserProfileType | null>(null)
  const [editProfile, setEditProfile] = useState<UserProfileType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [streakData, setStreakData] = useState<UserStreak | null>(null)
  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)

  // 3. useEffect hook
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      setIsLoading(true)
      setIsStatsLoading(true)

      try {
        const [profileData, streaksData, achievementsData] = await Promise.all([
          getUserProfile(user.id),
          getUserStreaks(user.id),
          // Fetch only earned achievements from database
          supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', user.id)
            .order('earned_at', { ascending: false })
        ])

        if (profileData) {
          setProfile(profileData)
          setShowSetup(false)
        } else {
          setShowSetup(true)
        }

        if (streaksData) {
          setStreakData(streaksData)
        }

        // Set only earned achievements
        setUserAchievements(achievementsData.data || [])

      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
        setIsStatsLoading(false)
      }
    }

    if (user) {
      loadUserData()
    }
  }, [user])

  // 4. Handler functions
  const handleProfileUpdate = async (updateData: ProfileUpdateData) => {
    if (!user) return

    try {
      const updatedProfile = await updateUserProfile(user.id, updateData)
      if (updatedProfile) {
        setProfile(updatedProfile)
        setEditProfile(null)
        toast.success('Profile updated successfully!')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const handleProfileSetup = async (setupData: ProfileUpdateData) => {
    if (!user) return

    try {
      const newProfile = await createUserProfile(user.id, setupData)
      if (newProfile) {
        setProfile(newProfile)
        setShowSetup(false)
        toast.success('Profile created successfully!')
      } else {
        throw new Error('Failed to create profile')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile. Please try again.')
    }
  }

  const handleSkipSetup = async () => {
    // Create minimal profile
    if (!user) return
    
    const minimalProfile = {
      full_name: user.user_metadata?.full_name || 'User',
      email: user.email || '',
      age: 25,
      gender: 'other' as const,
      height: 170,
      current_weight: 70,
      fitness_goal: 'maintenance' as const,
      target_weight: 70,
      activity_level: 'moderately_active' as const,
      daily_calorie_goal: 2000,
      daily_water_goal: 2000,
      daily_protein_goal: 60,
      daily_carbs_goal: 250,
      daily_fats_goal: 65,
    }

    try {
      const newProfile = await createUserProfile(user.id, minimalProfile)
      if (newProfile) {
        setProfile(newProfile)
        setShowSetup(false)
        toast.success('Basic profile created!')
      }
    } catch (error) {
      console.error('Error creating basic profile:', error)
      toast.error('Failed to create basic profile')
    }
  }

  // 5. Conditional renders after all hooks
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    )
  }

  if (!profile && !showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    )
  }

  if (showSetup) {
    return (
      <ProfileSetup
        userEmail={user.email || ''}
        userName={user.user_metadata?.full_name || 'User'}
        onComplete={handleProfileSetup}
        onSkip={handleSkipSetup}
      />
    )
  }

  // 6. Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Google Auth User Profile */}
        <UserProfile />

        {/* App Profile Section */}
        <div className="space-y-6">
          {/* Header */}
          <ProfileHeader 
            isEditing={isEditing} 
            onEdit={() => {
              setIsEditing(true)
              setEditProfile(profile) // Copy current profile to editProfile
            }} 
            onSave={async () => {
              if (editProfile) {
                await handleProfileUpdate({
                  full_name: editProfile.full_name,
                  age: editProfile.age,
                  gender: editProfile.gender as 'male' | 'female' | 'other',
                  height: editProfile.height,
                  current_weight: editProfile.current_weight,
                  fitness_goal: editProfile.fitness_goal,
                  target_weight: editProfile.target_weight,
                  activity_level: editProfile.activity_level,
                  daily_calorie_goal: editProfile.daily_calorie_goal,
                  daily_water_goal: editProfile.daily_water_goal,
                  daily_protein_goal: editProfile.daily_protein_goal,
                  daily_carbs_goal: editProfile.daily_carbs_goal,
                  daily_fats_goal: editProfile.daily_fats_goal,
                })
              }
              setIsEditing(false)
            }} 
          />

          {/* Health Metrics */}
          <HealthMetrics profile={profile} />

          {/* Quick Stats */}
          <QuickStats
            bmi={profile.bmi.toString()}
            longestStreak={streakData?.max_streak || 0}
            totalMealsLogged={profile.total_meals_logged || 0}
            isLoading={isStatsLoading}
          />

          {/* Personal Information */}
          <PersonalInfo
            profile={isEditing && editProfile ? {
              name: editProfile.full_name,
              email: editProfile.email,
              age: editProfile.age,
              gender: editProfile.gender,
              height: editProfile.height,
              currentWeight: editProfile.current_weight,
            } : {
              name: profile.full_name,
              email: profile.email,
              age: profile.age,
              gender: profile.gender,
              height: profile.height,
              currentWeight: profile.current_weight,
            }}
            isEditing={isEditing}
            onProfileChange={(newProfile) => {
              if (isEditing && editProfile) {
                setEditProfile({
                  ...editProfile, // <-- use editProfile, not profile
                  full_name: newProfile.name,
                  email: newProfile.email,
                  age: newProfile.age,
                  gender: newProfile.gender as 'male' | 'female' | 'other',
                  height: newProfile.height,
                  current_weight: newProfile.currentWeight,
                })
              }
            }}
          />

          {/* Fitness Goals */}
          <FitnessGoals
            goals={isEditing && editProfile ? {
              fitnessGoal: editProfile.fitness_goal,
              targetWeight: editProfile.target_weight,
              activityLevel: editProfile.activity_level,
            } : {
              fitnessGoal: profile.fitness_goal,
              targetWeight: profile.target_weight,
              activityLevel: profile.activity_level,
            }}
            isEditing={isEditing}
            onGoalsChange={(newGoals) => {
              if (isEditing && editProfile) {
                setEditProfile({
                  ...editProfile,
                  fitness_goal: newGoals.fitnessGoal as 'muscle_gain' | 'fat_loss' | 'maintenance' | 'endurance',
                  target_weight: newGoals.targetWeight,
                  activity_level: newGoals.activityLevel as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active',
                })
              }
            }}
          />

          {/* Nutrition Goals */}
          <NutritionGoals
            goals={isEditing && editProfile ? {
              daily_calorie_goal: editProfile.daily_calorie_goal,
              daily_water_goal: editProfile.daily_water_goal,
              daily_protein_goal: editProfile.daily_protein_goal,
              daily_carbs_goal: editProfile.daily_carbs_goal,
              daily_fats_goal: editProfile.daily_fats_goal,
            } : {
              daily_calorie_goal: profile.daily_calorie_goal,
              daily_water_goal: profile.daily_water_goal,
              daily_protein_goal: profile.daily_protein_goal,
              daily_carbs_goal: profile.daily_carbs_goal,
              daily_fats_goal: profile.daily_fats_goal,
            }}
            isEditing={isEditing}
            onGoalsChange={newGoals => {
              if (isEditing && editProfile) {
                setEditProfile({
                  ...editProfile,
                  ...newGoals,
                })
              }
            }}
          />

          {/* Achievements */}
          <Achievements 
            achievements={userAchievements.map(achievement => ({
              name: achievement.achievement_name,
              icon: achievement.achievement_icon,
              earned: true,
              earnedAt: achievement.earned_at
            }))}
            isLoading={isStatsLoading}
          />

          {/* Account Info */}
          <AccountInfo joinDate={profile.created_at} />
        </div>
      </div>

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
  )
}

// Add description helper function
const getAchievementDescription = (id: string) => {
  const descriptions = {
    'first_week': 'Log meals for 7 consecutive days',
    'protein_champ': 'Meet protein goals for 5 days',
    'hydration_hero': 'Meet water intake goals for 5 days',
    'meal_master': 'Log 50 meals total'
  }
  return descriptions[id as keyof typeof descriptions] || ''
}
