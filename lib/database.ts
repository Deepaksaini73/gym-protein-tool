import { supabase } from './supabase'

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // in cm
  current_weight: number // in kg
  target_weight: number // in kg
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'endurance'
  bmi: number
  daily_calorie_goal: number
  daily_protein_goal: number
  daily_carbs_goal: number
  daily_fats_goal: number
  daily_water_goal: number // in ml
  created_at: string
  updated_at: string
}

export interface CreateProfileData {
  full_name: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  current_weight: number
  target_weight: number
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'endurance'
}

export interface UpdateProfileData {
  full_name?: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  height?: number
  current_weight?: number
  target_weight?: number
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal?: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'endurance'
}

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
  const heightInM = height / 100
  return Number(((weight / (heightInM * heightInM))).toFixed(1))
}

// Calculate daily calorie needs using Mifflin-St Jeor Equation
export const calculateDailyCalories = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: string,
  fitnessGoal: string
): number => {
  let bmr: number
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78
  }

  let tdee = bmr

  switch (activityLevel) {
    case 'sedentary':
      tdee = bmr * 1.2
      break
    case 'lightly_active':
      tdee = bmr * 1.375
      break
    case 'moderately_active':
      tdee = bmr * 1.5 // lowered slightly for better prediction
      break
    case 'very_active':
      tdee = bmr * 1.7 // lowered slightly for better prediction
      break
    default:
      tdee = bmr * 1.2
  }

  switch (fitnessGoal) {
    case 'muscle_gain':
      tdee += 250 // lowered from 300
      break
    case 'fat_loss':
      tdee -= 400 // lowered from 500
      break
    case 'maintenance':
      break
    case 'endurance':
      tdee += 150 // lowered from 200
      break
  }

  return Math.round(tdee)
}

export const calculateMacroGoals = (dailyCalories: number, fitnessGoal: string) => {
  let proteinRatio: number
  let carbsRatio: number
  let fatsRatio: number

  switch (fitnessGoal) {
    case 'muscle_gain':
      proteinRatio = 0.25 // reduced from 30%
      carbsRatio = 0.5
      fatsRatio = 0.25
      break
    case 'fat_loss':
      proteinRatio = 0.3 // reduced from 35%
      carbsRatio = 0.4
      fatsRatio = 0.3
      break
    case 'maintenance':
      proteinRatio = 0.2 // reduced from 25%
      carbsRatio = 0.55
      fatsRatio = 0.25
      break
    case 'endurance':
      proteinRatio = 0.15
      carbsRatio = 0.65
      fatsRatio = 0.2
      break
    default:
      proteinRatio = 0.2
      carbsRatio = 0.55
      fatsRatio = 0.25
  }

  return {
    protein: Math.round((dailyCalories * proteinRatio) / 4),
    carbs: Math.round((dailyCalories * carbsRatio) / 4),
    fats: Math.round((dailyCalories * fatsRatio) / 9),
  }
} 


// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not configured')
      throw new Error('Supabase configuration missing')
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Supabase error fetching user profile:', error)
      
      // Check if it's a "not found" error (which is normal for new users)
      if (error.code === 'PGRST116') {
        console.log('User profile not found - this is normal for new users')
        return null
      }
      
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

// Create user profile
export const createUserProfile = async (userId: string, profileData: CreateProfileData): Promise<UserProfile | null> => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not configured')
      throw new Error('Supabase configuration missing')
    }

    const dailyCalories = calculateDailyCalories(
      profileData.current_weight,
      profileData.height,
      profileData.age,
      profileData.gender,
      profileData.activity_level,
      profileData.fitness_goal
    )

    const macroGoals = calculateMacroGoals(dailyCalories, profileData.fitness_goal)
    const bmi = calculateBMI(profileData.current_weight, profileData.height)

    const newProfile = {
      user_id: userId,
      ...profileData,
      bmi,
      daily_calorie_goal: dailyCalories,
      daily_protein_goal: macroGoals.protein,
      daily_carbs_goal: macroGoals.carbs,
      daily_fats_goal: macroGoals.fats,
      daily_water_goal: 2500, // Default 2.5L
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([newProfile])
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating user profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, updateData: UpdateProfileData): Promise<UserProfile | null> => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not configured')
      throw new Error('Supabase configuration missing')
    }

    // Get current profile to calculate new goals
    const currentProfile = await getUserProfile(userId)
    if (!currentProfile) {
      throw new Error('User profile not found')
    }

    const updatedData = { ...currentProfile, ...updateData }
    
    const dailyCalories = calculateDailyCalories(
      updatedData.current_weight,
      updatedData.height,
      updatedData.age,
      updatedData.gender,
      updatedData.activity_level,
      updatedData.fitness_goal
    )

    const macroGoals = calculateMacroGoals(dailyCalories, updatedData.fitness_goal)
    const bmi = calculateBMI(updatedData.current_weight, updatedData.height)

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        bmi,
        daily_calorie_goal: dailyCalories,
        daily_protein_goal: macroGoals.protein,
        daily_carbs_goal: macroGoals.carbs,
        daily_fats_goal: macroGoals.fats,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating user profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export interface UserStreak {
  id: string
  user_id: string
  current_streak: number
  max_streak: number
  updated_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_name: string
  achievement_icon: string
  earned_at: string
}

export async function getUserStreaks(userId: string): Promise<UserStreak | null> {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user streaks:', error)
    return null
  }
  return data
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user achievements:', error)
    return []
  }
  return data || []
}

// Add Feedback Interface
export interface Feedback {
  id: string
  user_id: string
  user_email: string
  user_name: string
  issue_type: 'bug' | 'feature' | 'improvement' | 'other'
  description: string
  feature_request?: string
  status: 'pending' | 'resolved'
  usability_rating: number
  health_impact_rating: number
  created_at: string
}

// Add Feedback Database Function
export async function submitFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedback])
    .select()
    .single()

  if (error) throw error
  return data
}