export interface Habit {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'weekly'
  completedDates: string[]
  createdAt: string
}

export interface DayRecord {
  date: string
  habitId: string
  completed: boolean
}
