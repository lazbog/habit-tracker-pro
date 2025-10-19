export interface Habit {
  id: string
  name: string
  description: string
  createdAt: string
  completedDates: string[]
  color: string
}

export interface HabitFormData {
  name: string
  description: string
  color: string
}