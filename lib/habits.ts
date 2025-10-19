'use client';

import { Habit, HabitRecord, HabitFormData, HabitWithRecords, DailyStats } from './types'
import { formatDate } from './utils'

const HABITS_KEY = 'habit-tracker-habits'
const RECORDS_KEY = 'habit-tracker-records'

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  const habits = localStorage.getItem(HABITS_KEY)
  return habits ? JSON.parse(habits) : []
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function addHabit(data: HabitFormData): Habit {
  const habits = getHabits()
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: formatDate(new Date())
  }
  saveHabits([...habits, newHabit])
  return newHabit
}

export function updateHabit(id: string, data: Partial<HabitFormData>): Habit | null {
  const habits = getHabits()
  const index = habits.findIndex(h => h.id === id)
  if (index === -1) return null
  
  const updatedHabit = { ...habits[index], ...data }
  habits[index] = updatedHabit
  saveHabits(habits)
  return updatedHabit
}

export function deleteHabit(id: string): boolean {
  const habits = getHabits()
  const filteredHabits = habits.filter(h => h.id !== id)
  if (filteredHabits.length === habits.length) return false
  
  saveHabits(filteredHabits)
  deleteRecordsByHabitId(id)
  return true
}

export function getRecords(): HabitRecord[] {
  if (typeof window === 'undefined') return []
  const records = localStorage.getItem(RECORDS_KEY)
  return records ? JSON.parse(records) : []
}

export function saveRecords(records: HabitRecord[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function toggleHabitRecord(habitId: string, date: string): HabitRecord {
  const records = getRecords()
  const existingIndex = records.findIndex(r => r.habitId === habitId && r.date === date)
  
  if (existingIndex !== -1) {
    records[existingIndex].completed = !records[existingIndex].completed
  } else {
    records.push({
      habitId,
      date,
      completed: true
    })
  }
  
  saveRecords(records)
  return records.find(r => r.habitId === habitId && r.date === date)!
}

export function deleteRecordsByHabitId(habitId: string): void {
  const records = getRecords()
  const filteredRecords = records.filter(r => r.habitId !== habitId)
  saveRecords(filteredRecords)
}

export function getHabitsWithRecords(date?: string): HabitWithRecords[] {
  const habits = getHabits()
  const records = getRecords()
  const targetDate = date || formatDate(new Date())
  
  return habits.map(habit => ({
    ...habit,
    records: records.filter(r => r.habitId === habit.id)
  }))
}

export function getHabitRecordsForDate(habitId: string, date: string): HabitRecord | null {
  const records = getRecords()
  return records.find(r => r.habitId === habitId && r.date === date) || null
}

export function getDailyStats(date: string): DailyStats {
  const habits = getHabits()
  const records = getRecords().filter(r => r.date === date)
  
  const completed = records.filter(r => r.completed).length
  const total = habits.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return {
    date,
    completed,
    total,
    percentage
  }
}

export function getWeeklyStats(startDate: Date, endDate: Date): DailyStats[] {
  const stats: DailyStats[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    stats.push(getDailyStats(formatDate(currentDate)))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return stats
}