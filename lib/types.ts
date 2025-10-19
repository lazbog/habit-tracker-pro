export interface Habit {
  id: string
  name: string
  description: string
  color: string
  icon: string
  createdAt: string
  completedDates: string[]
  targetStreak: number
  currentStreak: number
}

export interface HabitFormData {
  name: string
  description: string
  color: string
  icon: string
  targetStreak: number
}

export interface HabitStats {
  totalHabits: number
  completedToday: number
  currentStreak: number
  longestStreak: number
  completionRate: number
}

export interface DailyProgress {
  date: string
  completed: number
  total: number
}