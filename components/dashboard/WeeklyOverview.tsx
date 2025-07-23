import { Card, CardContent } from "@/components/ui/card"
import { CalendarX } from "lucide-react"

interface DayData {
  day: string
  date: string
  calories: number
  protein: number
  carbs: number
  fats: number
  water: number
}

interface WeeklyOverviewProps {
  days: DayData[]
  isLoading?: boolean
}

export function WeeklyOverview({ days, isLoading = false }: WeeklyOverviewProps) {
  // Show empty state if no data
  if (!isLoading && (!days || days.length === 0)) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <CalendarX className="w-12 h-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No Data Yet</h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Start logging your meals and water intake to see your weekly overview here.
              Your nutrition journey begins with the first log!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="py-2 px-3 whitespace-nowrap">Day</th>
                <th className="py-2 px-3 whitespace-nowrap">Date</th>
                <th className="py-2 px-3 whitespace-nowrap">Calories</th>
                <th className="py-2 px-3 whitespace-nowrap">Protein</th>
                <th className="py-2 px-3 whitespace-nowrap">Carbs</th>
                <th className="py-2 px-3 whitespace-nowrap">Fats</th>
                <th className="py-2 px-3 whitespace-nowrap">Water</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0 animate-pulse">
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-14"></div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-14"></div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-14"></div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                  </tr>
                ))
              ) : (
                days.map((d, i) => (
                  <tr
                    key={d.date}
                    className={`border-b last:border-0 hover:bg-gray-50 transition-colors duration-200 ${
                      i === 0 ? "bg-emerald-50 font-medium" : ""
                    }`}
                  >
                    <td className="py-2 px-3 whitespace-nowrap">{d.day}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{d.date}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{d.calories.toLocaleString()}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{d.protein}g</td>
                    <td className="py-2 px-3 whitespace-nowrap">{d.carbs}g</td>
                    <td className="py-2 px-3 whitespace-nowrap">{d.fats}g</td>
                    <td className="py-2 px-3 whitespace-nowrap">{d.water}ml</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}