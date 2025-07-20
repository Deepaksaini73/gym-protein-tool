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
    // Average between male & female if unknown
    bmr = 10 * weight + 6.25 * height - 5 * age - 78
  }

  let tdee = bmr

  // Activity multiplier
  switch (activityLevel) {
    case 'sedentary':
      tdee = bmr * 1.2
      break
    case 'lightly_active':
      tdee = bmr * 1.375
      break
    case 'moderately_active':
      tdee = bmr * 1.55
      break
    case 'very_active':
      tdee = bmr * 1.725
      break
    default:
      tdee = bmr * 1.2 // fallback to sedentary
  }

  // Goal adjustment
  switch (fitnessGoal) {
    case 'muscle_gain':
      tdee += 300
      break
    case 'fat_loss':
      tdee -= 500
      break
    case 'maintenance':
      // No change
      break
    case 'endurance':
      tdee += 200
      break
  }

  return Math.round(tdee)
}

// Calculate macronutrient goals
export const calculateMacroGoals = (dailyCalories: number, fitnessGoal: string) => {
  let proteinRatio: number
  let carbsRatio: number
  let fatsRatio: number

  switch (fitnessGoal) {
    case 'muscle_gain':
      proteinRatio = 0.3 // 30%
      carbsRatio = 0.45 // 45%
      fatsRatio = 0.25 // 25%
      break
    case 'fat_loss':
      proteinRatio = 0.35 // 35%
      carbsRatio = 0.35 // 35%
      fatsRatio = 0.3 // 30%
      break
    case 'maintenance':
      proteinRatio = 0.25 // 25%
      carbsRatio = 0.5 // 50%
      fatsRatio = 0.25 // 25%
      break
    case 'endurance':
      proteinRatio = 0.2 // 20%
      carbsRatio = 0.6 // 60%
      fatsRatio = 0.2 // 20%
      break
    default:
      proteinRatio = 0.25
      carbsRatio = 0.5
      fatsRatio = 0.25
  }

  return {
    protein: Math.round((dailyCalories * proteinRatio) / 4), // 4 calories per gram
    carbs: Math.round((dailyCalories * carbsRatio) / 4),
    fats: Math.round((dailyCalories * fatsRatio) / 9), // 9 calories per gram
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