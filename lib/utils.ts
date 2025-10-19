import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Habit } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isToday(date: string): boolean {
  return date === formatDate(new Date())
}

export function calculateStreak(habit: Habit): number {
  if (habit.completedDates.length === 0) return 0
  
  const sortedDates = [...habit.completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )
  
  let streak = 0
  const today = formatDate(new Date())
  let currentDate = new Date(today)
  
  for (const date of sortedDates) {
    const checkDate = formatDate(currentDate)
    if (date === checkDate) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (new Date(date) < new Date(checkDate)) {
      break
    }
  }
  
  return streak
}

export function getCompletionRate(habit: Habit): number {
  if (habit.completedDates.length === 0) return 0
  
  const createdDate = new Date(habit.createdAt)
  const today = new Date()
  const daysSinceCreation = Math.ceil(
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return Math.round((habit.completedDates.length / daysSinceCreation) * 100)
}