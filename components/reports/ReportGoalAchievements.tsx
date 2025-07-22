import { Progress } from "@/components/ui/progress";

interface ReportGoalAchievementsProps {
  calorieGoalHit: number;
  proteinGoalHit: number;
  waterGoalHit: number;
}

export function ReportGoalAchievements({ calorieGoalHit, proteinGoalHit, waterGoalHit }: ReportGoalAchievementsProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Goal Achievement</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Calorie Goals Hit</span>
          <span className="text-sm font-medium">{calorieGoalHit}/7 days</span>
        </div>
        <Progress value={(calorieGoalHit / 7) * 100} className="h-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Protein Goals Hit</span>
          <span className="text-sm font-medium">{proteinGoalHit}/7 days</span>
        </div>
        <Progress value={(proteinGoalHit / 7) * 100} className="h-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Water Goals Hit</span>
          <span className="text-sm font-medium">{waterGoalHit}/7 days</span>
        </div>
        <Progress value={(waterGoalHit / 7) * 100} className="h-2" />
      </div>
    </div>
  );
} 