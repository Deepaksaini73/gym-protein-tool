export const ACHIEVEMENTS = {
  FIRST_LOG: {
    name: "First Food Log",
    icon: "🍽️",
    description: "Log your first meal",
    requirement: 1
  },
  STREAK_3: {
    name: "3 Day Streak",
    icon: "🔥",
    description: "Maintain a 3 day logging streak",
    requirement: 3
  },
  STREAK_7: {
    name: "Weekly Warrior",
    icon: "⚔️",
    description: "Maintain a 7 day logging streak",
    requirement: 7
  },
  WATER_GOAL: {
    name: "Hydration Hero",
    icon: "💧",
    description: "Meet water goal for 5 days",
    requirement: 5
  },
  PROTEIN_MASTER: {
    name: "Protein Perfect",
    icon: "💪",
    description: "Meet protein goal for 5 days",
    requirement: 5
  },
  CALORIES_GOAL: {
    name: "Calorie Counter",
    icon: "🎯",
    description: "Stay within calorie goal for 7 days",
    requirement: 7
  }
} as const;

export type Achievement = {
  name: string;
  icon: string;
  earned: boolean;
  progress: number;
};