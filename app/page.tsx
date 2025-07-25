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
  const [lastActiveStreak, setLastActiveStreak] = useState(0);
  const [displayStreak, setDisplayStreak] = useState(0);
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

      // Move streak calculation AFTER logs are fetched and processed
      const updateStreakLogic = async () => {
        const today = getISTDate();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        const todayStr = formatDateForDB(today);
        const yesterdayStr = formatDateForDB(yesterday);

        // Get existing streak data
        const { data: streakData } = await supabase
          .from("user_streaks")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Check if user logged food today
        const todayLogs = (logs || []).filter(log => log.date === todayStr);
        const hasLoggedToday = todayLogs.length > 0;

        // Check if user logged food yesterday
        const yesterdayLogs = (logs || []).filter(log => log.date === yesterdayStr);
        const hasLoggedYesterday = yesterdayLogs.length > 0;

        let newCurrentStreak = 0;
        let newLastActiveStreak = 0;
        let newMaxStreak = streakData?.max_streak || 0;
        let streakUpdated = false;

        if (streakData) {
          const lastUpdateDate = new Date(streakData.updated_at);
          const lastUpdateStr = formatDateForDB(lastUpdateDate);
          const daysSinceUpdate = Math.floor((today.getTime() - lastUpdateDate.getTime()) / (24 * 60 * 60 * 1000));
          
          // Check if this is a new day
          if (lastUpdateStr !== todayStr) {
            if (hasLoggedToday) {
              // User logged today
              if (hasLoggedYesterday || streakData.current_streak === 0) {
                // Continue or start streak
                newCurrentStreak = streakData.current_streak + 1;
                newLastActiveStreak = newCurrentStreak; // Update last active streak
              } else if (daysSinceUpdate === 1) {
                // Missed yesterday but continuing from before
                newCurrentStreak = 1; // Start fresh
                newLastActiveStreak = newCurrentStreak;
              } else {
                // Multiple days missed
                newCurrentStreak = 1; // Start fresh
                newLastActiveStreak = newCurrentStreak;
              }
              streakUpdated = true;
            } else {
              // User hasn't logged today
              if (daysSinceUpdate >= 2) {
                // More than 1 day gap - streak is broken
                newCurrentStreak = 0;
                newLastActiveStreak = 0; // Reset last active as well
                streakUpdated = true;
              } else {
                // Only 1 day since last log - preserve streak info
                newCurrentStreak = streakData.current_streak;
                newLastActiveStreak = streakData.last_active_streak || streakData.current_streak;
              }
            }
            newMaxStreak = Math.max(newCurrentStreak, streakData.max_streak);
          } else {
            // Same day as last update
            newCurrentStreak = streakData.current_streak;
            newLastActiveStreak = streakData.last_active_streak || streakData.current_streak;
            newMaxStreak = streakData.max_streak;
          }
        } else {
          // No existing streak data
          if (hasLoggedToday) {
            newCurrentStreak = 1;
            newLastActiveStreak = 1;
            newMaxStreak = 1;
            streakUpdated = true;
          }
        }

        // Update database if needed
        if (streakUpdated || !streakData) {
          await supabase.from("user_streaks").upsert({
            user_id: user.id,
            current_streak: newCurrentStreak,
            last_active_streak: newLastActiveStreak,
            max_streak: newMaxStreak,
            updated_at: new Date().toISOString()
          });

          // Show achievement toasts for milestones
          if (newCurrentStreak > 0 && streakUpdated) {
            if (newCurrentStreak === 1 && (!streakData || streakData.current_streak === 0)) {
              toast.success('🎯 Streak started!', {
                description: "Great job logging your first meal today!"
              });
            } else if (newCurrentStreak === 3) {
              toast.success('🔥 3 day streak!', {
                description: "You're on fire! Keep it up!"
              });
            } else if (newCurrentStreak === 7) {
              toast.success('⚔️ Weekly warrior!', {
                description: "Amazing! You've logged for a full week!"
              });
            } else if (newCurrentStreak > 7 && newCurrentStreak % 7 === 0) {
              toast.success(`🏆 ${newCurrentStreak} day streak!`, {
                description: "Incredible consistency! You're a nutrition champion!"
              });
            }
          }
        }

        return {
          currentStreak: newCurrentStreak,
          lastActiveStreak: newLastActiveStreak,
          maxStreak: newMaxStreak,
          streakActive: hasLoggedToday,
          displayStreak: hasLoggedToday ? newCurrentStreak : newLastActiveStreak // Show last active if not logged today
        };
      };

      // Call the streak logic after logs are processed
      const streakResult = await updateStreakLogic();

      // Calculate stats with fixed decimals
      const statsData = {
        totalMeals: todayLogs.length,
        avgCalories: todayLogs.length > 0 
          ? Number((dailyIntakeData.calories / todayLogs.length).toFixed(2))
          : 0,
        bestStreak: streakResult.maxStreak
      };

      // Calculate weekly overview data - ADD THIS
      const filledWeekDays = getLast7Days().map(day => {
        const dayLogs = (logs || []).filter(log => log.date === day.date);
        const dayWater = (water || []).filter(w => w.date === day.date);
        
        return {
          ...day,
          calories: Number(dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0).toFixed(2)),
          protein: Number(dayLogs.reduce((sum, log) => sum + (log.protein || 0), 0).toFixed(2)),
          carbs: Number(dayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0).toFixed(2)),
          fats: Number(dayLogs.reduce((sum, log) => sum + (log.fats || 0), 0).toFixed(2)),
          water: Number(dayWater.reduce((sum, w) => sum + (w.amount || 0), 0).toFixed(2))
        };
      });

      // Calculate recent meals data - ADD THIS
      const recentMealsData = (logs || [])
        .slice(0, 5)
        .map(log => ({
          id: log.id,
          name: log.food_name,
          calories: Number((log.calories || 0).toFixed(2)),
          protein: Number((log.protein || 0).toFixed(2)),
          time: new Date(log.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          date: log.date
        }));

      // Calculate weekly goals met count - ADD THIS
      const goalsMetCount = filledWeekDays.filter(day => {
        const calorieGoal = profileData?.daily_calorie_goal || 2000;
        const proteinGoal = profileData?.daily_protein_goal || 60;
        const waterGoal = profileData?.daily_water_goal || 2000;
        
        const caloriesMet = day.calories >= calorieGoal * 0.8 && day.calories <= calorieGoal * 1.2;
        const proteinMet = day.protein >= proteinGoal;
        const waterMet = day.water >= waterGoal;
        
        return caloriesMet && proteinMet && waterMet;
      }).length;

      // Helper functions to calculate goal days - MOVE BEFORE calculateAchievements
      const calculateWaterGoalDays = () => {
        const dates = [...new Set((water || []).map(log => log.date))];
        return dates.filter(date => {
          const dayTotal = (water || [])
            .filter(log => log.date === date)
            .reduce((sum, log) => sum + (log.amount || 0), 0);
          return dayTotal >= (profileData?.daily_water_goal || 2000);
        }).length;
      };

      const calculateProteinGoalDays = () => {
        const dates = [...new Set((logs || []).map(log => log.date))];
        return dates.filter(date => {
          const dayTotal = (logs || [])
            .filter(log => log.date === date)
            .reduce((sum, log) => sum + (log.protein || 0), 0);
          return dayTotal >= (profileData?.daily_protein_goal || 60);
        }).length;
      };

      const calculateCalorieGoalDays = () => {
        const dates = [...new Set((logs || []).map(log => log.date))];
        return dates.filter(date => {
          const dayTotal = (logs || [])
            .filter(log => log.date === date)
            .reduce((sum, log) => sum + (log.calories || 0), 0);
          const target = profileData?.daily_calorie_goal || 2000;
          return dayTotal >= target * 0.9 && dayTotal <= target * 1.1;
        }).length;
      };

      // Calculate achievements - FIX currentStreak references
      const calculateAchievements = async () => {
        // Get earned achievements from database
        const { data: existingAchievements } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        // Define all available achievements with progress calculation
        const allAchievements = [
          {
            name: "First Food Log",
            icon: "🍽️",
            description: "Log your first meal",
            requirement: 1,
            earned: existingAchievements?.some(a => a.achievement_name === "First Food Log") || false,
            currentCount: Math.min(1, (logs || []).length),
            progress: Math.min(100, ((logs || []).length > 0 ? 100 : 0))
          },
          {
            name: "3 Day Streak",
            icon: "🔥", 
            description: "Maintain a 3 day logging streak",
            requirement: 3,
            earned: existingAchievements?.some(a => a.achievement_name === "3 Day Streak") || false,
            currentCount: Math.min(3, streakResult.currentStreak),
            progress: Math.min(100, (streakResult.currentStreak / 3) * 100)
          },
          {
            name: "Weekly Warrior",
            icon: "⚔️",
            description: "Maintain a 7 day logging streak", 
            requirement: 7,
            earned: existingAchievements?.some(a => a.achievement_name === "Weekly Warrior") || false,
            currentCount: Math.min(7, streakResult.currentStreak),
            progress: Math.min(100, (streakResult.currentStreak / 7) * 100)
          },
          {
            name: "Hydration Hero",
            icon: "💧",
            description: "Meet water goal for 5 days",
            requirement: 5,
            earned: existingAchievements?.some(a => a.achievement_name === "Hydration Hero") || false,
            currentCount: Math.min(5, calculateWaterGoalDays()),
            progress: Math.min(100, (calculateWaterGoalDays() / 5) * 100)
          },
          {
            name: "Protein Perfect", 
            icon: "💪",
            description: "Meet protein goal for 5 days",
            requirement: 5,
            earned: existingAchievements?.some(a => a.achievement_name === "Protein Perfect") || false,
            currentCount: Math.min(5, calculateProteinGoalDays()),
            progress: Math.min(100, (calculateProteinGoalDays() / 5) * 100)
          },
          {
            name: "Calorie Counter",
            icon: "🎯", 
            description: "Stay within calorie goal for 7 days",
            requirement: 7,
            earned: existingAchievements?.some(a => a.achievement_name === "Calorie Counter") || false,
            currentCount: Math.min(7, calculateCalorieGoalDays()),
            progress: Math.min(100, (calculateCalorieGoalDays() / 7) * 100)
          }
        ];

        // IMPORTANT: Check for newly earned achievements and save them to database
        for (const achievement of allAchievements) {
          const isAlreadyEarned = existingAchievements?.some(a => a.achievement_name === achievement.name);
          const shouldBeEarned = achievement.progress >= 100;

          if (shouldBeEarned && !isAlreadyEarned) {
            // This is a newly earned achievement - save it to database
            try {
              const { error } = await supabase
                .from('user_achievements')
                .insert({
                  user_id: user.id,
                  achievement_name: achievement.name,
                  achievement_icon: achievement.icon,
                  earned_at: new Date().toISOString()
                });

              if (!error) {
                // Show success toast
                toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
                  description: achievement.description,
                  duration: 5000,
                });

                // Update the achievement as earned
                achievement.earned = true;
              } else {
                console.error('Error saving achievement:', error);
              }
            } catch (error) {
              console.error('Error inserting achievement:', error);
            }
          }
        }

        // Add earned dates for completed achievements
        const achievementsWithDates = allAchievements.map(achievement => {
          const earned = existingAchievements?.find(a => a.achievement_name === achievement.name);
          return {
            ...achievement,
            earnedAt: earned?.earned_at
          };
        });

        setRealAchievements(achievementsWithDates);
      };

      if (isMounted.current) {
        setStreak(streakResult.currentStreak);
        setLastActiveStreak(streakResult.lastActiveStreak);
        setDisplayStreak(streakResult.displayStreak);
        setMaxStreak(streakResult.maxStreak);  
        setStreakActive(streakResult.streakActive);
        // Set stats after calculating them
        setStats(statsData);
        setWeekOverview(filledWeekDays); // Now defined
        setFoodLogs(logs || []);
        setWaterLogs(water || []);
        setDailyIntake(dailyIntakeData);
        setRecentMeals(recentMealsData); // Now defined
        setWeeklyGoalsMet(goalsMetCount); // Now defined
      }

      // Call calculateAchievements AFTER helper functions are defined
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
          fetchData(); // This will recalculate streak
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

      // Add subscription to user_streaks table for real-time streak updates
      const streakChannel = supabase
        .channel('user-streaks')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_streaks',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          // Update streak state immediately when database changes
          if (payload.new && isMounted.current) {
            setStreak(payload.new.current_streak);
            setLastActiveStreak(payload.new.last_active_streak);
            setMaxStreak(payload.new.max_streak);
            setDisplayStreak(payload.new.last_active_streak || payload.new.current_streak);
            setStreakActive(payload.new.current_streak > 0);
          }
        })
        .subscribe();

      return () => {
        isMounted.current = false;
        foodChannel.unsubscribe();
        waterChannel.unsubscribe();
        streakChannel.unsubscribe(); // Add this cleanup
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
        <DashboardHeader 
            name={profile?.full_name || user.user_metadata?.full_name || user.email} 
            streak={displayStreak} // Use displayStreak instead of streak
            maxStreak={maxStreak} 
            streakActive={streakActive} 
          />

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
