"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { User, Target, Activity, Scale, Ruler, Heart, Calculator } from "lucide-react"
import { CreateProfileData, calculateBMI, calculateDailyCalories, calculateMacroGoals } from "@/lib/database"

interface ProfileSetupProps {
  userEmail: string
  userName: string
  onComplete: (profileData: CreateProfileData) => void
  onSkip: () => void
}

export function ProfileSetup({ userEmail, userName, onComplete, onSkip }: ProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CreateProfileData>>({
    full_name: userName,
    email: userEmail,
    age: 25,
    gender: 'male',
    height: 170,
    current_weight: 70,
    target_weight: 75,
    activity_level: 'moderately_active',
    fitness_goal: 'muscle_gain',
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const updateFormData = (field: keyof CreateProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(formData as CreateProfileData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const calculatePreview = () => {
    if (!formData.height || !formData.current_weight || !formData.age || !formData.gender || !formData.activity_level || !formData.fitness_goal) {
      return null
    }

    const bmi = calculateBMI(formData.current_weight, formData.height)
    const dailyCalories = calculateDailyCalories(
      formData.current_weight,
      formData.height,
      formData.age,
      formData.gender,
      formData.activity_level,
      formData.fitness_goal
    )
    const macros = calculateMacroGoals(dailyCalories, formData.fitness_goal)

    return { bmi, dailyCalories, macros }
  }

  const preview = calculatePreview()

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="w-12 h-12 mx-auto text-emerald-600" />
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
              <p className="text-gray-600">Let's start with your basic details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => updateFormData('full_name', e.target.value)}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Age</label>
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', Number(e.target.value))}
                    className="mt-1"
                    placeholder="25"
                    min="13"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Scale className="w-12 h-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Body Measurements</h3>
              <p className="text-gray-600">Help us calculate your nutrition needs</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                  <Input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => updateFormData('height', Number(e.target.value))}
                    className="mt-1"
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Weight (kg)</label>
                  <Input
                    type="number"
                    value={formData.current_weight || ''}
                    onChange={(e) => updateFormData('current_weight', Number(e.target.value))}
                    className="mt-1"
                    placeholder="70"
                    min="30"
                    max="300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Target Weight (kg)</label>
                <Input
                  type="number"
                  value={formData.target_weight || ''}
                  onChange={(e) => updateFormData('target_weight', Number(e.target.value))}
                  className="mt-1"
                  placeholder="75"
                  min="30"
                  max="300"
                />
              </div>

              {preview && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Current BMI</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{preview.bmi}</div>
                  <p className="text-xs text-blue-700">
                    {preview.bmi < 18.5 ? 'Underweight' : 
                     preview.bmi < 25 ? 'Normal weight' : 
                     preview.bmi < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Activity className="w-12 h-12 mx-auto text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Activity Level</h3>
              <p className="text-gray-600">How active are you on a daily basis?</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                { value: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
              ].map((activity) => (
                <div
                  key={activity.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.activity_level === activity.value
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                  onClick={() => updateFormData('activity_level', activity.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.label}</h4>
                      <p className="text-sm text-gray-600">{activity.desc}</p>
                    </div>
                    {formData.activity_level === activity.value && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 mx-auto text-emerald-600" />
              <h3 className="text-xl font-semibold text-gray-900">Fitness Goal</h3>
              <p className="text-gray-600">What's your primary fitness objective?</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build muscle mass and strength' },
                { value: 'fat_loss', label: 'Fat Loss', desc: 'Lose weight and reduce body fat' },
                { value: 'maintenance', label: 'Maintenance', desc: 'Maintain current weight and fitness' },
                { value: 'endurance', label: 'Endurance', desc: 'Improve cardiovascular fitness' },
              ].map((goal) => (
                <div
                  key={goal.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.fitness_goal === goal.value
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                  onClick={() => updateFormData('fitness_goal', goal.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.label}</h4>
                      <p className="text-sm text-gray-600">{goal.desc}</p>
                    </div>
                    {formData.fitness_goal === goal.value && (
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {preview && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-medium text-emerald-800 mb-3">Your Calculated Goals</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-900">{preview.dailyCalories}</div>
                    <p className="text-xs text-emerald-700">Daily Calories</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-900">{preview.macros.protein}g</div>
                    <p className="text-xs text-emerald-700">Protein Goal</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-6 px-4 flex items-start justify-center overflow-y-auto pb-24 sm:pb-6 sm:items-center">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm my-auto">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
          <p className="text-gray-600">Step {step} of {totalSteps}</p>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          {renderStep()}

          <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white/90 backdrop-blur-sm">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={!formData.full_name || !formData.age || !formData.height || !formData.current_weight}
            >
              {step === totalSteps ? 'Complete Setup' : 'Next'}
            </Button>
          </div>

          {step === 1 && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}