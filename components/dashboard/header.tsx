import { Card, CardContent } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface HeaderProps {
  name: string
  streak: number
  maxStreak?: number
  streakActive?: boolean
}

export function DashboardHeader({ name, streak, maxStreak, streakActive = true }: HeaderProps) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-100 to-blue-100">
      <CardContent className="p-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-full border-2 border-orange-200">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className={
                streakActive
                  ? "font-bold text-orange-800"
                  : "font-bold text-orange-300 opacity-50 blur-[1px]"
              }>{streak}</span>
              <span className="text-sm text-orange-700">day streak</span>
              {typeof maxStreak === "number" && (
                <span className="ml-3 text-xs text-orange-600"></span>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi, {name}! 👋</h1>
            <p className="text-gray-600">Let's check your nutrition progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}