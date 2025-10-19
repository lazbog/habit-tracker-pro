export interface Habit {
  id: string
  name: string
  description?: string
  createdAt: string
  color: string
  icon: string
}

export interface HabitRecord {
  id: string
  habitId: string
  date: string
  completed: boolean
}

export interface HabitStats {
  habitId: string
  habitName: string
  totalDays: number
  completedDays: number
  streak: number
  completionRate: number
}

export interface DailyStats {
  date: string
  totalHabits: number
  completedHabits: number
  completionRate: number
}

export interface ChartData {
  date: string
  completionRate: number
}