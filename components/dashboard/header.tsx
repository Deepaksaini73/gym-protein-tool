import { Flame } from "lucide-react"

interface HeaderProps {
  name: string
  streak: number
}

export function DashboardHeader({ name, streak }: HeaderProps) {
  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center space-x-2">
        <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-full border-2 border-orange-200">
          <Flame className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-orange-800">{streak}</span>
          <span className="text-sm text-orange-700">day streak</span>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hi, {name}! 👋</h1>
        <p className="text-gray-600">Let's check your nutrition progress</p>
      </div>
    </div>
  )
} 