export interface Habit {
  id: string
  name: string
  description?: string
  color: string
  createdAt: string
  targetDays: number
  category: string
}

export interface HabitRecord {
  id: string
  habitId: string
  date: string
  completed: boolean
  notes?: string
}

export interface HabitWithRecords extends Habit {
  records: HabitRecord[]
}

export interface DailyStats {
  date: string
  completed: number
  total: number
  percentage: number
}

export interface WeeklyStats {
  week: string
  completed: number
  total: number
  percentage: number
}

export interface CategoryStats {
  category: string
  completed: number
  total: number
  percentage: number
}