"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
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
import { getUserProfile, createUserProfile, updateUserProfile, UserProfile as UserProfileType, CreateProfileData, UpdateProfileData } from "@/lib/database"
import { toast } from "sonner"

const mockAchievements = [
  { name: "First Week", icon: "🎯", earned: true },
  { name: "Protein Champion", icon: "💪", earned: true },
  { name: "Hydration Hero", icon: "💧", earned: false },
  { name: "Meal Prep Master", icon: "🍱", earned: true },
]

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfileType | null>(null)
  const [editProfile, setEditProfile] = useState<UserProfileType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      loadUserProfile()
    }
  }, [user, loading])

  const loadUserProfile = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const userProfile = await getUserProfile(user.id)
      if (userProfile) {
        setProfile(userProfile)
      } else {
        setShowSetup(true)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSetup = async (profileData: CreateProfileData) => {
    if (!user) return

    try {
      const newProfile = await createUserProfile(user.id, profileData)
      if (newProfile) {
        setProfile(newProfile)
        setShowSetup(false)
        toast.success('Profile created successfully!')
      } else {
        toast.error('Failed to create profile')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    }
  }

  const handleProfileUpdate = async (updateData: UpdateProfileData) => {
    if (!user || !profile) return

    try {
      const updatedProfile = await updateUserProfile(user.id, updateData)
      if (updatedProfile) {
        setProfile(updatedProfile)
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleSkipSetup = () => {
    setShowSetup(false)
    toast.info('You can complete your profile later')
  }

  if (loading || isLoading) {
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

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
            longestStreak={23} // This would come from another table
            totalMealsLogged={156} // This would come from another table
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
          <Achievements achievements={mockAchievements} />

          {/* Account Info */}
          <AccountInfo joinDate={profile.created_at} />
        </div>
      </div>
    </div>
  )
}
