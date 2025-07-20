import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

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
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              value={profile.email}
              onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              className="border-2 focus:border-emerald-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Age</label>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => onProfileChange({ ...profile, age: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
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
                value={profile.height}
                onChange={(e) => onProfileChange({ ...profile, height: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <Input
                type="number"
                value={profile.currentWeight}
                onChange={(e) => onProfileChange({ ...profile, currentWeight: Number.parseInt(e.target.value) })}
                disabled={!isEditing}
                className="border-2 focus:border-emerald-300"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 