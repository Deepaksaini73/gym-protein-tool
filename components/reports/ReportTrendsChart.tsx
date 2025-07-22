import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportTrendsChartProps {
  days: { day: string; calories: number; protein: number; carbs: number; fats: number; water: number }[];
}

export function ReportTrendsChart({ days }: ReportTrendsChartProps) {
  const data = {
    labels: days.map(d => d.day),
    datasets: [
      {
        label: "Calories",
        data: days.map(d => d.calories),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
      {
        label: "Protein",
        data: days.map(d => d.protein),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
      {
        label: "Carbs",
        data: days.map(d => d.carbs),
        backgroundColor: "rgba(251, 191, 36, 0.7)",
      },
      {
        label: "Fats",
        data: days.map(d => d.fats),
        backgroundColor: "rgba(244, 63, 94, 0.7)",
      },
      {
        label: "Water",
        data: days.map(d => d.water),
        backgroundColor: "rgba(34, 211, 238, 0.7)",
      },
    ],
  };
  return (
    <div className="bg-white rounded-lg p-4 border-2 border-emerald-100 shadow mb-4">
      <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
    </div>
  );
} 