'use client';

import { Habit } from '@/lib/types'

const STORAGE_KEY = 'habit-tracker-data'

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch {
    // Handle storage errors silently
  }
}

export function completeHabit(habitId: string): void {
  const habits = getHabits()
  const habit = habits.find(h => h.id === habitId)
  
  if (habit) {
    const today = new Date().toISOString().split('T')[0]
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today)
      saveHabits(habits)
    }
  }
}

export function uncompleteHabit(habitId: string): void {
  const habits = getHabits()
  const habit = habits.find(h => h.id === habitId)
  
  if (habit) {
    const today = new Date().toISOString().split('T')[0]
    habit.completedDates = habit.completedDates.filter(date => date !== today)
    saveHabits(habits)
  }
}