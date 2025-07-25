import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  age: number
  gender: string
  height: number
  currentWeight: number
}

interface PersonalInfoProps {
  profile: UserProfile
  isEditing: boolean
  onProfileChange: (profile: UserProfile) => void
}

export function PersonalInfo({ profile, isEditing, onProfileChange }: PersonalInfoProps) {
  // Helper function to handle empty/null values
  const handleNumberInput = (value: string, field: keyof UserProfile) => {
    const numberValue = value === '' ? 0 : Number(value)
    onProfileChange({ ...profile, [field]: numberValue })
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <User className="w-5 h-5 mr-2 text-emerald-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input
              value={profile.name}
              onChange={(e) => onProfileChange({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Email
              <Lock className="w-3 h-3 ml-1 text-gray-400" />
            </label>
            <Input
              value={profile.email}
              disabled={true} // Always disabled
              className="border-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed for security reasons</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Age</label>
              <Input
                type="number"
                value={profile.age || ''}
                onChange={(e) => handleNumberInput(e.target.value, 'age')}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <Select
                value={profile.gender}
                onValueChange={(value) => onProfileChange({ ...profile, gender: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className="border-2 focus:border-emerald-300">
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <Input
                type="number"
                value={profile.height || ''}
                onChange={(e) => handleNumberInput(e.target.value, 'height')}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <Input
                type="number"
                value={profile.currentWeight || ''}
                onChange={(e) => handleNumberInput(e.target.value, 'currentWeight')}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
                min="0"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}