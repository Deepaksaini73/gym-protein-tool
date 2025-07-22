import { Card, CardContent } from "@/components/ui/card"

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
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardContent className="p-4 overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="text-left text-gray-700 border-b">
              <th className="py-2 pr-4">Day</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Calories</th>
              <th className="py-2 pr-4">Protein</th>
              <th className="py-2 pr-4">Carbs</th>
              <th className="py-2 pr-4">Fats</th>
              <th className="py-2 pr-4">Water</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 7 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0 animate-pulse">
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-14"></div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-14"></div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-14"></div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                </tr>
              ))
            ) : (
              days.map((d, i) => (
                <tr
                  key={d.date}
                  className={`border-b last:border-0 transition-colors duration-200 ${
                    i === 0 ? "bg-emerald-50 font-bold" : ""
                  }`}
                >
                  <td className="py-2 pr-4">{d.day}</td>
                  <td className="py-2 pr-4">{d.date}</td>
                  <td className="py-2 pr-4">{d.calories}</td>
                  <td className="py-2 pr-4">{d.protein}g</td>
                  <td className="py-2 pr-4">{d.carbs}g</td>
                  <td className="py-2 pr-4">{d.fats}g</td>
                  <td className="py-2 pr-4">{d.water}ml</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}