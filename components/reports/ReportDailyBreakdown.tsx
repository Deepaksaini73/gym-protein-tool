import { Card, CardContent } from "@/components/ui/card";

interface Meal {
  name: string;
  time: string;
  calories: number;
}

interface DayBreakdown {
  date: string;
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
  meals: Meal[];
  goals: {
    calories: boolean;
    protein: boolean;
    water: boolean;
  };
}

interface ReportDailyBreakdownProps {
  days: DayBreakdown[];
}

export function ReportDailyBreakdown({ days }: ReportDailyBreakdownProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardContent className="p-4 overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="text-left text-gray-700 border-b">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Calories</th>
              <th className="py-2 pr-4">Protein</th>
              <th className="py-2 pr-4">Carbs</th>
              <th className="py-2 pr-4">Fats</th>
              <th className="py-2 pr-4">Water</th>
              <th className="py-2 pr-4">Meals</th>
              <th className="py-2 pr-4">Goals</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium">{d.day} <span className="text-gray-400">{d.date}</span></td>
                <td className="py-2 pr-4">{d.calories}</td>
                <td className="py-2 pr-4">{d.protein}g</td>
                <td className="py-2 pr-4">{d.carbs}g</td>
                <td className="py-2 pr-4">{d.fats}g</td>
                <td className="py-2 pr-4">{d.water}ml</td>
                <td className="py-2 pr-4">
                  {d.meals.length > 0 ? (
                    <ul>
                      {d.meals.map((m, i) => (
                        <li key={i}>
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-gray-400 ml-1">{m.time}</span>
                          <span className="ml-1 text-emerald-700">{m.calories} cal</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-2 pr-4">
                  <span className={d.goals.calories ? "text-green-600" : "text-gray-400"}>C</span>{" "}
                  <span className={d.goals.protein ? "text-green-600" : "text-gray-400"}>P</span>{" "}
                  <span className={d.goals.water ? "text-green-600" : "text-gray-400"}>W</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
} 