"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  DashboardHeader,
  QuickStats,
  ProgressCard,
  WeeklyChart,
  RecentMeals,
  Achievements,
  WeeklyGoals,
  WeeklyOverview,
} from "@/components/dashboard"
import { GoogleSignInButton, UserProfile } from "@/components/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Award } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { FeedbackButton } from "@/components/shared/feedback-button"
import { FeedbackForm } from "@/components/shared/feedback-form"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation' // Changed from 'next/router'
import { ACHIEVEMENTS } from "@/lib/achievements"



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
  const [streakActive, setStreakActive] = useState(true)
  const [realAchievements, setRealAchievements] = useState<any[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [weekOverview, setWeekOverview] = useState<any[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  // Add new state for refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [needsProfile, setNeedsProfile] = useState(false)
  const router = useRouter() // This will now work correctly

  // Add mounted ref to handle race conditions
  const isMounted = useRef(false)

  // Add retry mechanism
  const retryFetch = async (attempts = 3, delay = 1000) => {
    for (let i = 0; i < attempts; i++) {
      try {
        await fetchData()
        return true
      } catch (error) {
        if (i === attempts - 1) throw error
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    return false
  }

  const formatDateForDB = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getISTDate = () => {
    const istDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return new Date(
      istDate.getFullYear(),
      istDate.getMonth(),
      istDate.getDate(),
      0, 0, 0
    );
  };

  // Update getLast7Days function
  const getLast7Days = () => {
    const days = [];
    const today = getISTDate();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatDateForDB(date);

      days.push({
        date: formattedDate,
        day: date.toLocaleDateString('en-US', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short'
        }),
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        water: 0
      });
    }
    return days;
  };

  // Update fetchData function to include all stats calculations
  const fetchData = async () => {
    if (!user || !isMounted.current) return;
    
    setIsDataLoading(true);
    try {
      // First check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profileData) {
        setNeedsProfile(true);
        setIsDataLoading(false);
        return;
      }

      // Get IST date range
      const today = getISTDate();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      
      const todayStr = formatDateForDB(today);
      const weekAgoStr = formatDateForDB(weekAgo);

      // Fetch logs data
      const [
        { data: logs, error: foodError },
        { data: water, error: waterError }
      ] = await Promise.all([
        supabase
          .from("food_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", weekAgoStr)
          .lte("date", todayStr)
          .order('date', { ascending: false }),
        supabase
          .from("water_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", weekAgoStr)
          .lte("date", todayStr)
          .order('date', { ascending: false })
      ]);

      if (foodError || waterError) throw foodError || waterError;

      // Set profile data
      setProfile(profileData);
      setDailyGoals({
        calories: profileData.daily_calorie_goal || 2000,
        protein: profileData.daily_protein_goal || 60,
        carbs: profileData.daily_carbs_goal || 250,
        fats: profileData.daily_fats_goal || 65,
        water: profileData.daily_water_goal || 2000
      });

      // Process today's data for stats
      const todayLogs = (logs || []).filter(log => log.date === todayStr);
      const todayWater = (water || []).filter(w => w.date === todayStr);

      // Calculate daily intake with fixed decimals
      const dailyIntakeData = {
        calories: Number(todayLogs.reduce((sum, log) => sum + (log.calories || 0), 0).toFixed(2)),
        protein: Number(todayLogs.reduce((sum, log) => sum + (log.protein || 0), 0).toFixed(2)),
        carbs: Number(todayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0).toFixed(2)),
        fats: Number(todayLogs.reduce((sum, log) => sum + (log.fats || 0), 0).toFixed(2)),
        water: Number(todayWater.reduce((sum, w) => sum + (w.amount || 0), 0).toFixed(2))
      };

      // Update streak calculation
      const hasToday = todayLogs.length > 0;
      let currentStreak = 0;
      let maxStreakVal = 0;

      // Get streak data
      const { data: streakData } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (hasToday) {
        currentStreak = streakData?.current_streak || 0;
        if (currentStreak === 0) {
          currentStreak = 1;
          // Update streak in database
          await supabase.from("user_streaks").upsert({
            user_id: user.id,
            current_streak: 1,
            max_streak: Math.max(1, streakData?.max_streak || 0),
            updated_at: new Date().toISOString()
          });
          
          toast.success('🎯 Started a new streak!', {
            description: "Keep logging meals to maintain your streak",
          });
        }
        maxStreakVal = Math.max(currentStreak, streakData?.max_streak || 0);
      }

      if (isMounted.current) {
        setStreak(currentStreak);
        setMaxStreak(maxStreakVal);
        setStreakActive(hasToday);
        // ... rest of the state updates
      }

      // Calculate stats with fixed decimals
      const statsData = {
        totalMeals: todayLogs.length,
        avgCalories: todayLogs.length > 0 
          ? Number((dailyIntakeData.calories / todayLogs.length).toFixed(2))
          : 0,
        bestStreak: maxStreakVal
      };

      // Process recent meals with IST time
      const recentMealsData = (logs || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map(log => ({
          name: log.food_name,
          calories: log.calories,
          time: new Date(log.created_at).toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          type: log.meal_type
        }));

      // Process weekly overview
      const weekDaysArr = getLast7Days();
      const filledWeekDays = weekDaysArr.map(day => {
        const dayFoodLogs = (logs || []).filter(log => log.date === day.date);
        const dayWaterLogs = (water || []).filter(log => log.date === day.date);

        return {
          ...day,
          calories: Number(dayFoodLogs.reduce((sum, log) => sum + (log.calories || 0), 0).toFixed(2)),
          protein: Number(dayFoodLogs.reduce((sum, log) => sum + (log.protein || 0), 0).toFixed(2)),
          carbs: Number(dayFoodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0).toFixed(2)),
          fats: Number(dayFoodLogs.reduce((sum, log) => sum + (log.fats || 0), 0).toFixed(2)),
          water: Number(dayWaterLogs.reduce((sum, log) => sum + (log.amount || 0), 0).toFixed(2))
        };
      });

      // Calculate weekly goals met
      const goalsMetCount = filledWeekDays.reduce((count, day) => {
        const meetsGoals = day.calories >= (profileData?.daily_calorie_goal || 2000) * 0.8 &&
                          day.water >= (profileData?.daily_water_goal || 2000) * 0.8;
        return count + (meetsGoals ? 1 : 0);
      }, 0);

      if (isMounted.current) {
        setWeekOverview(filledWeekDays);
        setFoodLogs(logs || []);
        setWaterLogs(water || []);
        setStats(statsData);
        setDailyIntake(dailyIntakeData);
        setRecentMeals(recentMealsData);
        setWeeklyGoalsMet(goalsMetCount);
      }

      // Calculate achievements
      const calculateAchievements = async () => {
        const achievements = [];
        
        // First Log Achievement
        const hasLogs = foodLogs.length > 0;
        achievements.push({
          name: ACHIEVEMENTS.FIRST_LOG.name,
          icon: ACHIEVEMENTS.FIRST_LOG.icon,
          earned: hasLogs,
          progress: hasLogs ? 100 : 0
        });

        // Streak Achievements
        const currentStreak = streak;
        achievements.push({
          name: ACHIEVEMENTS.STREAK_3.name,
          icon: ACHIEVEMENTS.STREAK_3.icon,
          earned: currentStreak >= 3,
          progress: Math.min(100, (currentStreak / 3) * 100)
        });

        achievements.push({
          name: ACHIEVEMENTS.STREAK_7.name,
          icon: ACHIEVEMENTS.STREAK_7.icon,
          earned: currentStreak >= 7,
          progress: Math.min(100, (currentStreak / 7) * 100)
        });

        // Water Goal Achievement
        const waterGoalDays = filledWeekDays.filter(day => 
          day.water >= (profileData?.daily_water_goal || 2000)
        ).length;
        achievements.push({
          name: ACHIEVEMENTS.WATER_GOAL.name,
          icon: ACHIEVEMENTS.WATER_GOAL.icon,
          earned: waterGoalDays >= 5,
          progress: Math.min(100, (waterGoalDays / 5) * 100)
        });

        // Protein Goal Achievement
        const proteinGoalDays = filledWeekDays.filter(day =>
          day.protein >= (profileData?.daily_protein_goal || 60)
        ).length;
        achievements.push({
          name: ACHIEVEMENTS.PROTEIN_MASTER.name,
          icon: ACHIEVEMENTS.PROTEIN_MASTER.icon,
          earned: proteinGoalDays >= 5,
          progress: Math.min(100, (proteinGoalDays / 5) * 100)
        });

        // Calorie Goal Achievement
        const calorieGoalDays = filledWeekDays.filter(day => {
          const target = profileData?.daily_calorie_goal || 2000;
          return day.calories >= target * 0.9 && day.calories <= target * 1.1;
        }).length;
        achievements.push({
          name: ACHIEVEMENTS.CALORIES_GOAL.name,
          icon: ACHIEVEMENTS.CALORIES_GOAL.icon,
          earned: calorieGoalDays >= 7,
          progress: Math.min(100, (calorieGoalDays / 7) * 100)
        });

        // Get existing achievements from database
        const { data: existingAchievements } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        // Update database with newly earned achievements
        for (const achievement of achievements) {
          if (achievement.earned) {
            const exists = existingAchievements?.some(a => a.achievement_name === achievement.name);
            if (!exists) {
              await supabase.from('user_achievements').insert({
                user_id: user.id,
                achievement_name: achievement.name,
                achievement_icon: achievement.icon,
                earned_at: new Date().toISOString()
              });

              // Show toast for new achievement
              toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
            }
          }
        }

        setRealAchievements(achievements);
      };

      await calculateAchievements();

    } catch (error) {
      console.error('Error fetching data:', error);
      setNeedsProfile(true);
    } finally {
      if (isMounted.current) {
        setIsDataLoading(false);
      }
    }
  }

  // Split into two effects - one for initialization, one for updates
  useEffect(() => {
    isMounted.current = true

    if (user) {
      // Initial load with retry
      retryFetch()
    }

    return () => {
      isMounted.current = false
    }
  }, [user]) // Only depends on user

  // Separate effect for refresh trigger
  useEffect(() => {
    if (user && isMounted.current && refreshTrigger > 0) {
      fetchData()
    }
  }, [refreshTrigger])

  // Add real-time subscription effect
  useEffect(() => {
    isMounted.current = true;

    if (user) {
      fetchData(); // Initial fetch

      // Subscribe to real-time changes
      const foodChannel = supabase
        .channel('food-logs')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'food_logs',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchData();
        })
        .subscribe();

      const waterChannel = supabase
        .channel('water-logs')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'water_logs',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        isMounted.current = false;
        foodChannel.unsubscribe();
        waterChannel.unsubscribe();
      };
    }
  }, [user]);

  // Add refresh function
  const refreshDashboard = useCallback(() => {
    if (isMounted.current) {
      setRefreshTrigger(prev => prev + 1)
    }
  }, [])


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

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Please set up your profile to start tracking your nutrition journey
            </p>
            <Button 
              onClick={() => router.push('/profile')} // Updated path
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Set Up Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is logged in - show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header with Streak */}
        <DashboardHeader name={profile?.full_name || user.user_metadata?.full_name || user.email} streak={streak} maxStreak={maxStreak} streakActive={streakActive} />

        {/* Quick Stats */}
        <QuickStats
          totalMeals={stats.totalMeals}
          avgCalories={stats.avgCalories}
          bestStreak={maxStreak}
        />


        {/* Today's Progress */}
        {dailyGoals && dailyIntake && (
          <ProgressCard dailyGoals={dailyGoals} dailyIntake={dailyIntake} hideWaterAdd />
        )}

        {/* Recent Meals */}
        <RecentMeals recentMeals={recentMeals} />

        {/* Weekly Overview */}
        <WeeklyOverview 
          days={weekOverview} 
          isLoading={isDataLoading} 
        />

        {/* Achievements Progress (dummy) */}
        <Achievements achievements={realAchievements} />

        {/* Weekly Goals Summary */}
        <WeeklyGoals weeklyGoalsMet={weeklyGoalsMet} />

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
  )
}
