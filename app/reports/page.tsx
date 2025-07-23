"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, Award, Download, Share2, BarChart3 } from "lucide-react"
import { ReportTrendsChart } from "@/components/reports/ReportTrendsChart";
import { generatePDF } from '@/lib/pdf-generator'
import { FeedbackButton } from "@/components/shared/feedback-button"
import { FeedbackForm } from "@/components/shared/feedback-form"
import { useRouter } from 'next/navigation'


const calculateGoalsMet = (dayLogs: any[], waterLog: any, profile: any) => {
  let goalsCount = 0;
  
  // Calculate daily totals
  const dailyCalories = dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0)
  const dailyProtein = dayLogs.reduce((sum, log) => sum + (log.protein || 0), 0)
  const dailyCarbs = dayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0)
  const dailyFats = dayLogs.reduce((sum, log) => sum + (log.fats || 0), 0)
  const dailyWater = waterLog?.amount || 0

  // Check if goals are met (now checking all 4 goals)
  if (dailyCalories >= (profile?.daily_calorie_goal || 0)) goalsCount++
  if (dailyProtein >= (profile?.daily_protein_goal || 0)) goalsCount++
  if (dailyCarbs >= (profile?.daily_carbs_goal || 0)) goalsCount++
  if (dailyWater >= (profile?.daily_water_goal || 0)) goalsCount++

  return goalsCount
}

const findBestWeek = (foodLogs: any[], profile: any) => {
  // Group logs by week
  const weeklyLogs = foodLogs.reduce((acc: any, log) => {
    const weekNum = Math.floor(new Date(log.date).getDate() / 7) + 1
    if (!acc[weekNum]) acc[weekNum] = []
    acc[weekNum].push(log)
    return acc
  }, {})

  // Find week with highest goal achievement
  let bestWeek = 1
  let bestScore = 0

  Object.entries(weeklyLogs).forEach(([week, logs]: [string, any]) => {
    const weekScore = (logs as any[]).reduce((score, log) => {
      if (log.calories >= (profile?.daily_calorie_goal || 0)) score++
      if (log.protein >= (profile?.daily_protein_goal || 0)) score++
      return score
    }, 0)

    if (weekScore > bestScore) {
      bestScore = weekScore
      bestWeek = parseInt(week)
    }
  })

  return `Week ${bestWeek}`
}

const findWorstWeek = (foodLogs: any[], profile: any) => {
  // Similar to findBestWeek but finds lowest score
  const weeklyLogs = foodLogs.reduce((acc: any, log) => {
    const weekNum = Math.floor(new Date(log.date).getDate() / 7) + 1
    if (!acc[weekNum]) acc[weekNum] = []
    acc[weekNum].push(log)
    return acc
  }, {})

  let worstWeek = 1
  let worstScore = Number.MAX_VALUE

  Object.entries(weeklyLogs).forEach(([week, logs]: [string, any]) => {
    const weekScore = (logs as any[]).reduce((score, log) => {
      if (log.calories >= (profile?.daily_calorie_goal || 0)) score++
      if (log.protein >= (profile?.daily_protein_goal || 0)) score++
      return score
    }, 0)

    if (weekScore < worstScore) {
      worstScore = weekScore
      worstWeek = parseInt(week)
    }
  })

  return `Week ${worstWeek}`
}

const calculateLongestStreak = (foodLogs: any[]) => {
  if (!foodLogs.length) return 0

  // Sort logs by date
  const sortedDates = [...new Set(foodLogs.map(log => log.date))].sort()
  
  let currentStreak = 1
  let maxStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

const calculateWeightChange = (profile: any) => {
  // This would need historical weight data
  // For now, return a mock value or 0
  return 0
}

// Add getRating function at the top with other helper functions
const getRating = (goalsHit: number) => {
  if (goalsHit >= 20) return "Excellent"
  if (goalsHit >= 15) return "Very Good"
  if (goalsHit >= 10) return "Good"
  return "Needs Improvement"
}

// Add these functions before the ReportsPage component
const exportReport = (data: any, profileData: any) => {
    return generatePDF(data, profileData)
  }

const shareReport = async (data: any, profile: any) => {
  try {
    const fileName = exportReport(data, profile);
    
    if (navigator.share) {
      // Create a blob from the PDF
      const response = await fetch(fileName);
      const blob = await response.blob();
      
      // Create a File object
      const file = new File([blob], fileName, { type: 'application/pdf' });

      // Share the file
      await navigator.share({
        title: 'My Nutrition Report',
        text: 'Check out my nutrition progress!',
        files: [file]
      });
    } else {
      // Fallback - just save the PDF locally
      alert('Sharing not supported on this device. PDF has been downloaded instead.');
    }
  } catch (err) {
    console.error('Error sharing:', err);
    alert('There was an error sharing the report. Please try downloading it instead.');
  }
};

// Add these helper functions at the top
const getISTDate = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

const formatDateForDB = (date: Date) => {
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ReportsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [needsProfile, setNeedsProfile] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("weekly")
  const [weeklyData, setWeeklyData] = useState<any>(null)
  const [monthlyData, setMonthlyData] = useState<any>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Move calculateGoalsHitInWeek inside component to access profile
  const calculateGoalsHitInWeek = (foodLogs: any[], waterLogs: any[], weekStart: Date, weekEnd: Date) => {
    let totalGoalsHit = 0

    for (let date = new Date(weekStart); date <= weekEnd; date.setDate(date.getDate() + 1)) {
      const dateStr = formatDateForDB(date)
      const dayLogs = foodLogs.filter(log => log.date === dateStr)
      const waterLog = waterLogs.find(log => log.date === dateStr)

      totalGoalsHit += calculateGoalsMet(dayLogs, waterLog, profile)
    }

    return totalGoalsHit
  }

  // Define fetchReportData before using it
  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Get IST date ranges
      const today = getISTDate()
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      const monthAgo = new Date(today)
      monthAgo.setDate(today.getDate() - 30)

      // Format dates for query using IST
      const todayStr = formatDateForDB(today)
      const weekAgoStr = formatDateForDB(weekAgo)
      const monthAgoStr = formatDateForDB(monthAgo)

      // Fetch all required data
      const [profileData, weekFoodLogs, monthFoodLogs, weekWaterLogs, monthWaterLogs, achievements] = await Promise.all([
        // Get user profile
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
        // Get week's food logs
        supabase.from('food_logs').select('*')
          .eq('user_id', user.id)
          .gte('date', weekAgoStr)
          .lte('date', todayStr),
        // Get month's food logs
        supabase.from('food_logs').select('*')
          .eq('user_id', user.id)
          .gte('date', monthAgoStr)
          .lte('date', todayStr),
        // Get week's water logs
        supabase.from('water_logs').select('*')
          .eq('user_id', user.id)
          .gte('date', weekAgoStr)
          .lte('date', todayStr),
        // Get month's water logs
        supabase.from('water_logs').select('*')
          .eq('user_id', user.id)
          .gte('date', monthAgoStr)
          .lte('date', todayStr),
        // Get achievements
        supabase.from('user_achievements').select('*')
          .eq('user_id', user.id)
      ])

      setProfile(profileData.data)

      // Process Weekly Data
      const weeklyProcessed = {
        period: `${weekAgoStr} to ${todayStr}`,
        summary: calculateWeeklySummary(weekFoodLogs.data || [], weekWaterLogs.data || [], profileData.data),
        dailyBreakdown: processDailyBreakdown(weekFoodLogs.data || [], weekWaterLogs.data || [], weekAgoStr, todayStr),
      }
      setWeeklyData(weeklyProcessed)

      // Process Monthly Data
      const monthlyProcessed = {
        period: `${new Date(monthAgoStr).toLocaleString('default', { month: 'long' })} ${new Date(monthAgoStr).getFullYear()}`,
        summary: calculateMonthlySummary(monthFoodLogs.data || [], monthWaterLogs.data || [], profileData.data),
        weeklyBreakdown: processWeeklyBreakdown(monthFoodLogs.data || [], monthWaterLogs.data || [], monthAgoStr, todayStr),
        topFoods: calculateTopFoods(monthFoodLogs.data || []),
        insights: generateInsights(monthFoodLogs.data || [], monthWaterLogs.data || [], profileData.data),
      }
      setMonthlyData(monthlyProcessed)

    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Profile check useEffect
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        setNeedsProfile(true);
      } else {
        setProfile(profileData);
        fetchReportData(); // Now fetchReportData is in scope
      }
    };

    if (user) {
      checkProfile();
    }
  }, [user]); // Added proper dependency

  useEffect(() => {
    if (!user) return

    fetchReportData()
  }, [user])

  // Helper functions
  const calculateWeeklySummary = (foodLogs: any[], waterLogs: any[], profile: any) => {
    return {
      avgCalories: Math.round(foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / 7),
      avgProtein: Math.round(foodLogs.reduce((sum, log) => sum + (log.protein || 0), 0) / 7),
      avgCarbs: Math.round(foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0) / 7),
      avgFats: Math.round(foodLogs.reduce((sum, log) => sum + (log.fats || 0), 0) / 7),
      avgWater: Math.round(waterLogs.reduce((sum, log) => sum + (log.amount || 0), 0) / 7),
      daysCompleted: new Set(foodLogs.map(log => log.date)).size,
      totalMeals: foodLogs.length,
      calorieGoalHit: foodLogs.filter(log => log.calories >= (profile?.daily_calorie_goal || 0)).length,
      proteinGoalHit: foodLogs.filter(log => log.protein >= (profile?.daily_protein_goal || 0)).length,
      waterGoalHit: waterLogs.filter(log => log.amount >= (profile?.daily_water_goal || 0)).length,
    }
  }

  const processDailyBreakdown = (foodLogs: any[], waterLogs: any[], startDate: string, endDate: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const result = []
    
    let currentDate = new Date(startDate)
    const end = new Date(endDate)

    while (currentDate <= end) {
      const dateStr = formatDateForDB(currentDate)
      const dayLogs = foodLogs.filter(log => log.date === dateStr)
      const waterLog = waterLogs.find(log => log.date === dateStr)

      result.push({
        // Add dateStr to make the key unique
        key: `${days[currentDate.getDay()]}-${dateStr}`,
        day: days[currentDate.getDay()],
        date: dateStr,
        calories: dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
        protein: dayLogs.reduce((sum, log) => sum + (log.protein || 0), 0),
        carbs: dayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0),
        fats: dayLogs.reduce((sum, log) => sum + (log.fats || 0), 0),
        water: waterLog?.amount || 0,
        goalsMet: calculateGoalsMet(dayLogs, waterLog, profile),
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  const calculateMonthlySummary = (foodLogs: any[], waterLogs: any[], profile: any) => {
    const totalDays = 30 // or use actual days in month
    return {
      avgCalories: Math.round(foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / totalDays),
      avgProtein: Math.round(foodLogs.reduce((sum, log) => sum + (log.protein || 0), 0) / totalDays),
      avgCarbs: Math.round(foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0) / totalDays),
      avgFats: Math.round(foodLogs.reduce((sum, log) => sum + (log.fats || 0), 0) / totalDays),
      avgWater: Math.round(waterLogs.reduce((sum, log) => sum + (log.amount || 0), 0) / totalDays),
      daysCompleted: new Set(foodLogs.map(log => log.date)).size,
      totalMeals: foodLogs.length,
      bestWeek: findBestWeek(foodLogs, profile),
      worstWeek: findWorstWeek(foodLogs, profile),
      streakRecord: calculateLongestStreak(foodLogs),
      weightChange: calculateWeightChange(profile),
    }
  }

  const processWeeklyBreakdown = (foodLogs: any[], waterLogs: any[], startDate: string, endDate: string) => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    const result = []

    // Split logs into weeks
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(weekStart.getDate() + (i * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekLogs = foodLogs.filter(log => {
        const logDate = new Date(log.date)
        return logDate >= weekStart && logDate <= weekEnd
      })

      const avgCalories = Math.round(weekLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / 7)
      const goalsHit = calculateGoalsHitInWeek(weekLogs, waterLogs, weekStart, weekEnd)

      result.push({
        week: `Week ${i + 1}`,
        avgCalories,
        goalsHit,
        rating: getRating(goalsHit)
      })
    }

    return result
  }

  const calculateTopFoods = (foodLogs: any[]) => {
    // Group by food name and count occurrences
    const foodCounts = foodLogs.reduce((acc: any, log) => {
      const key = log.food_name
      if (!acc[key]) {
        acc[key] = {
          name: key,
          count: 0,
          calories: 0
        }
      }
      acc[key].count++
      acc[key].calories += log.calories || 0
      return acc
    }, {})

    // Convert to array and sort by count
    return Object.values(foodCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
  }

  const generateInsights = (foodLogs: any[], waterLogs: any[], profile: any) => {
    const insights = []

    // Protein goal achievement
    const proteinGoalDays = foodLogs.filter(log => log.protein >= (profile?.daily_protein_goal || 0)).length
    if (proteinGoalDays >= 20) {
      insights.push({
        type: "success",
        message: "You consistently hit your protein goals this month!"
      })
    }

    // Water intake warning
    const waterGoalDays = waterLogs.filter(log => log.amount >= (profile?.daily_water_goal || 0)).length
    const missedWaterDays = 30 - waterGoalDays
    if (missedWaterDays > 7) {
      insights.push({
        type: "warning",
        message: `Water intake was below target on ${missedWaterDays} days`
      })
    }

    // Best performance week
    const bestWeek = findBestWeek(foodLogs, profile)
    insights.push({
      type: "info",
      message: `Your best performance was during ${bestWeek}`
    })

    // Nutrition balance tip
    const avgCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0) / foodLogs.length
    if (avgCarbs < (profile?.daily_carbs_goal || 0) * 0.8) {
      insights.push({
        type: "tip",
        message: "Consider adding more complex carbs to balance your nutrition"
      })
    }

    return insights
  }

  // Initialize default data structures
  const defaultMonthlyData = {
    period: '',
    summary: {
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFats: 0,
      avgWater: 0,
      daysCompleted: 0,
      totalMeals: 0,
      bestWeek: 'No data',
      worstWeek: 'No data',
      streakRecord: 0,
      weightChange: 0
    },
    weeklyBreakdown: [],
    topFoods: [],
    insights: []
  }

  const defaultWeeklyData = {
    period: '',
    summary: {
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFats: 0,
      avgWater: 0,
      daysCompleted: 0,
      totalMeals: 0,
      calorieGoalHit: 0,
      proteinGoalHit: 0,
      waterGoalHit: 0
    },
    dailyBreakdown: []
  }

  // Get current data based on selected period
  const currentData = selectedPeriod === "weekly" 
    ? (weeklyData || defaultWeeklyData) 
    : (monthlyData || defaultMonthlyData);

  // First check - Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Second check - Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Please sign in to view your nutrition reports
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Third check - Needs profile setup
  if (needsProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Please set up your profile to access nutrition reports
            </p>
            <Button 
              onClick={() => router.push('/profile')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Set Up Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading only when fetching data for authenticated users with profiles
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  // Inside ReportsPage component
  const handleExport = () => {
    exportReport(currentData, profile);
  };

  const handleShare = async () => {
    await shareReport(currentData, profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Reports</h1>
          <p className="text-gray-600">Track your progress and insights</p>

          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Period Selection */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-900">Report Period</span>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 border-2 focus:border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Period Summary */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                    {selectedPeriod === "weekly" ? "Weekly" : "Monthly"} Summary
                  </CardTitle>
                  <p className="text-sm text-gray-600">{currentData.period}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 border-2 border-emerald-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-emerald-700">{currentData.summary.avgCalories}</div>
                        <p className="text-xs text-emerald-600">Avg Calories/Day</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-700">{currentData.summary.avgProtein}g</div>
                        <p className="text-xs text-blue-600">Avg Protein/Day</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 border-2 border-cyan-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-cyan-700">{currentData.summary.avgWater}ml</div>
                        <p className="text-xs text-cyan-600">Avg Water/Day</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-700">{currentData.summary.totalMeals}</div>
                        <p className="text-xs text-purple-600">Total Meals</p>
                      </div>
                    </div>
                  </div>

                  {selectedPeriod === "weekly" && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Goal Achievement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Calorie Goals Hit</span>
                          <span className="text-sm font-medium">{weeklyData.summary.calorieGoalHit}/7 days</span>
                        </div>
                        <Progress value={(weeklyData.summary.calorieGoalHit / 7) * 100} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Protein Goals Hit</span>
                          <span className="text-sm font-medium">{weeklyData.summary.proteinGoalHit}/7 days</span>
                        </div>
                        <Progress value={(weeklyData.summary.proteinGoalHit / 7) * 100} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Water Goals Hit</span>
                          <span className="text-sm font-medium">{weeklyData.summary.waterGoalHit}/7 days</span>
                        </div>
                        <Progress value={(weeklyData.summary.waterGoalHit / 7) * 100} className="h-2" />
                      </div>
                    </div>
                  )}

                  {selectedPeriod === "monthly" && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Monthly Highlights</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                          <p className="text-xs text-green-600">Best Week</p>
                          <p className="font-medium text-green-800">{monthlyData.summary.bestWeek}</p>
                        </div>
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3">
                          <p className="text-xs text-orange-600">Longest Streak</p>
                          <p className="font-medium text-orange-800">{monthlyData.summary.streakRecord} days</p>
                        </div>
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-600">Weight Change</p>
                          <p className="font-medium text-blue-800">+{monthlyData.summary.weightChange}kg</p>
                        </div>
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
                          <p className="text-xs text-purple-600">Days Logged</p>
                          <p className="font-medium text-purple-800">{monthlyData.summary.daysCompleted}/31</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Visual Chart */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    {selectedPeriod === "weekly" ? "Daily Breakdown" : "Weekly Breakdown"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPeriod === "weekly" ? (
                      <div className="grid grid-cols-7 gap-1 h-40">
                        {weeklyData.dailyBreakdown.map((day) => {
                          const calorieHeight = (day.calories / 2500) * 100
                          const isToday = day.date === new Date().toISOString().slice(0, 10)
                          return (
                            <div key={day.key} className="flex flex-col items-center space-y-2">
                              <div className="flex-1 flex items-end">
                                <div
                                  className={`w-full rounded-t-md transition-all duration-300 ${
                                    isToday
                                      ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                                      : "bg-gradient-to-t from-gray-400 to-gray-300"
                                  }`}
                                  style={{ height: `${calorieHeight}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${isToday ? "text-emerald-700" : "text-gray-600"}`}>
                                {day.day}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  day.goalsMet >= 3 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {day.goalsMet}/4
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {monthlyData.weeklyBreakdown.map((week, index) => (
                          <div
                            key={week.week}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900">{week.week}</span>
                              <Badge
                                variant="secondary"
                                className={`${
                                  week.rating === "Excellent"
                                    ? "bg-green-100 text-green-800"
                                    : week.rating === "Very Good"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {week.rating}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{week.avgCalories} cal</p>
                              <p className="text-xs text-gray-600">{week.goalsHit}/28 goals</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Tab */}
          <TabsContent value="detailed">
            <div className="space-y-6">
              {selectedPeriod === "monthly" && (
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Top Foods This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {monthlyData.topFoods.map((food, index) => (
                        <div
                          key={food.name}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
                              <span className="text-sm font-bold text-emerald-700">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{food.name}</p>
                              <p className="text-xs text-gray-600">{food.count} times logged</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            {food.calories} cal total
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Nutrition Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentData.summary.avgProtein}g</div>
                        <p className="text-sm text-gray-600">Avg Protein</p>
                        <div className="mt-2 h-2 bg-blue-200 rounded-full">
                          <div className="h-2 bg-blue-600 rounded-full" style={{ width: "83%" }} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentData.summary.avgCarbs}g</div>
                        <p className="text-sm text-gray-600">Avg Carbs</p>
                        <div className="mt-2 h-2 bg-green-200 rounded-full">
                          <div className="h-2 bg-green-600 rounded-full" style={{ width: "89%" }} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{currentData.summary.avgFats}g</div>
                        <p className="text-sm text-gray-600">Avg Fats</p>
                        <div className="mt-2 h-2 bg-yellow-200 rounded-full">
                          <div className="h-2 bg-yellow-600 rounded-full" style={{ width: "85%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="space-y-6">
              {selectedPeriod === "monthly" && (
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg text-gray-900">
                      <Award className="w-5 h-5 mr-2 text-yellow-600" />
                      AI Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {monthlyData.insights.map((insight, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${
                            insight.type === "success"
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                              : insight.type === "warning"
                                ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
                                : insight.type === "info"
                                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                                  : "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"
                          }`}
                        >
                          <p
                            className={`text-sm ${
                              insight.type === "success"
                                ? "text-green-800"
                                : insight.type === "warning"
                                  ? "text-orange-800"
                                  : insight.type === "info"
                                    ? "text-blue-800"
                                    : "text-purple-800"
                            }`}
                          >
                            {insight.type === "success" && "✅ "}
                            {insight.type === "warning" && "⚠️ "}
                            {insight.type === "info" && "ℹ️ "}
                            {insight.type === "tip" && "💡 "}
                            {insight.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Protein Intake</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Improving ↗️</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Calorie Consistency</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Stable ➡️</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Hydration</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">Needs Work ↘️</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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
