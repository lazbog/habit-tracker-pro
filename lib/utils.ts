import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'yyyy-MM-dd')
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

export function getMonthDays(date: Date) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const startWeek = startOfWeek(start)
  const endWeek = endOfWeek(end)
  return eachDayOfInterval({ start: startWeek, end: endWeek })
}

export function getStreakDays(records: { date: string; completed: boolean }[]): number {
  if (!records.length) return 0
  
  const sortedRecords = records
    .filter(r => r.completed)
    .map(r => new Date(r.date))
    .sort((a, b) => b.getTime() - a.getTime())
  
  if (!sortedRecords.length) return 0
  
  let streak = 1
  let currentDate = sortedRecords[0]
  
  for (let i = 1; i < sortedRecords.length; i++) {
    const nextDate = sortedRecords[i]
    const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      streak++
      currentDate = nextDate
    } else {
      break
    }
  }
  
  return streak
}

export function getCompletionPercentage(records: { completed: boolean }[]): number {
  if (!records.length) return 0
  const completed = records.filter(r => r.completed).length
  return Math.round((completed / records.length) * 100)
}