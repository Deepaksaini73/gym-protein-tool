"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, Award, Download, Share2, BarChart3 } from "lucide-react"

// Mock data for reports
const weeklyData = {
  period: "March 18-24, 2024",
  summary: {
    avgCalories: 2050,
    avgProtein: 142,
    avgCarbs: 195,
    avgFats: 68,
    avgWater: 2800,
    daysCompleted: 6,
    totalMeals: 21,
    calorieGoalHit: 5,
    proteinGoalHit: 6,
    waterGoalHit: 4,
  },
  dailyBreakdown: [
    { day: "Mon", calories: 2100, protein: 140, carbs: 200, fats: 70, water: 2800, goalsMet: 3 },
    { day: "Tue", calories: 1950, protein: 135, carbs: 180, fats: 65, water: 3200, goalsMet: 4 },
    { day: "Wed", calories: 2250, protein: 155, carbs: 210, fats: 75, water: 2900, goalsMet: 4 },
    { day: "Thu", calories: 2050, protein: 145, carbs: 195, fats: 68, water: 3100, goalsMet: 4 },
    { day: "Fri", calories: 1900, protein: 130, carbs: 170, fats: 60, water: 2700, goalsMet: 2 },
    { day: "Sat", calories: 2300, protein: 160, carbs: 220, fats: 80, water: 3300, goalsMet: 4 },
    { day: "Sun", calories: 1850, protein: 125, carbs: 180, fats: 65, water: 2250, goalsMet: 3 },
  ],
}

const monthlyData = {
  period: "March 2024",
  summary: {
    avgCalories: 2080,
    avgProtein: 145,
    avgCarbs: 198,
    avgFats: 70,
    avgWater: 2850,
    daysCompleted: 28,
    totalMeals: 84,
    bestWeek: "Week 3",
    worstWeek: "Week 1",
    streakRecord: 12,
    weightChange: +2.3,
  },
  weeklyBreakdown: [
    { week: "Week 1", avgCalories: 1980, goalsHit: 15, rating: "Good" },
    { week: "Week 2", avgCalories: 2120, goalsHit: 18, rating: "Excellent" },
    { week: "Week 3", avgCalories: 2150, goalsHit: 20, rating: "Excellent" },
    { week: "Week 4", avgCalories: 2070, goalsHit: 17, rating: "Very Good" },
  ],
  topFoods: [
    { name: "Grilled Chicken Breast", count: 18, calories: 2970 },
    { name: "Brown Rice", count: 15, calories: 1680 },
    { name: "Greek Yogurt", count: 12, calories: 708 },
    { name: "Broccoli", count: 10, calories: 340 },
    { name: "Banana", count: 8, calories: 712 },
  ],
  insights: [
    { type: "success", message: "You consistently hit your protein goals this month!" },
    { type: "warning", message: "Water intake was below target on 8 days" },
    { type: "info", message: "Your best performance was during Week 3" },
    { type: "tip", message: "Consider adding more vegetables to increase fiber intake" },
  ],
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly")
  const [selectedWeek, setSelectedWeek] = useState("current")

  const currentData = selectedPeriod === "weekly" ? weeklyData : monthlyData

  const exportReport = () => {
    alert("Report exported as PDF! (Feature will be implemented)")
  }

  const shareReport = () => {
    alert("Report shared! (Feature will be implemented)")
  }

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
              onClick={exportReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              onClick={shareReport}
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
                        {weeklyData.dailyBreakdown.map((day, index) => {
                          const calorieHeight = (day.calories / 2500) * 100
                          const isToday = index === 6
                          return (
                            <div key={day.day} className="flex flex-col items-center space-y-2">
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
      </div>
    </div>
  )
}
