export interface Habit {
  id: string
  name: string
  description?: string
  createdAt: string
  color: string
}

export interface DayRecord {
  date: string // YYYY-MM-DD format
  completedHabitIds: string[]
}

export interface HabitFormData {
  name: string
  description?: string
  color: string
}