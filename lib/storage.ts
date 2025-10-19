import { Habit } from './types'

const STORAGE_KEY = 'habit-tracker-pro-habits'

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const habits = JSON.parse(stored)
    return Array.isArray(habits) ? habits : []
  } catch (error) {
    console.error('Error loading habits from localStorage:', error)
    return []
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch (error) {
    console.error('Error saving habits to localStorage:', error)
  }
}
