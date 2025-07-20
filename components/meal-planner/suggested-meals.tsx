import { MealCard } from "./meal-card"

interface Meal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fats: number
  prepTime: number
  difficulty: string
  dietTypes: string[]
}

interface SuggestedMealsProps {
  meals: Meal[]
  onAddToPlan: (meal: Meal) => void
  onLogMeal: (meal: Meal) => void
}

export function SuggestedMeals({ meals, onAddToPlan, onLogMeal }: SuggestedMealsProps) {
  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onAddToPlan={onAddToPlan}
          onLogMeal={onLogMeal}
        />
      ))}
    </div>
  )
} 