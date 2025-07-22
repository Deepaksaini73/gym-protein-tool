import { Card, CardContent } from "@/components/ui/card";

interface ReportSummaryProps {
  summary: {
    avgCalories: number;
    avgProtein: number;
    avgWater: number;
    totalMeals: number;
  };
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 border-2 border-emerald-200">
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-700">{summary.avgCalories}</div>
          <p className="text-xs text-emerald-600">Avg Calories/Day</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-700">{summary.avgProtein}g</div>
          <p className="text-xs text-blue-600">Avg Protein/Day</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 border-2 border-cyan-200">
        <div className="text-center">
          <div className="text-xl font-bold text-cyan-700">{summary.avgWater}ml</div>
          <p className="text-xs text-cyan-600">Avg Water/Day</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-200">
        <div className="text-center">
          <div className="text-xl font-bold text-purple-700">{summary.totalMeals}</div>
          <p className="text-xs text-purple-600">Total Meals</p>
        </div>
      </div>
    </div>
  );
} 