'use client';

import { Habit, DayRecord, HabitFormData } from './types'

const HABITS_KEY = 'habit-tracker-pro-habits'
const RECORDS_KEY = 'habit-tracker-pro-records'

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
    createdAt: new Date().toISOString(),
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
  
  // Also remove from records
  const records = getRecords()
  const updatedRecords = records.map(record => ({
    ...record,
    completedHabitIds: record.completedHabitIds.filter(hid => hid !== id)
  }))
  saveRecords(updatedRecords)
  
  return true
}

export function getRecords(): DayRecord[] {
  if (typeof window === 'undefined') return []
  const records = localStorage.getItem(RECORDS_KEY)
  return records ? JSON.parse(records) : []
}

export function saveRecords(records: DayRecord[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function getTodayRecord(): DayRecord {
  const today = new Date().toISOString().split('T')[0]
  const records = getRecords()
  let record = records.find(r => r.date === today)
  
  if (!record) {
    record = { date: today, completedHabitIds: [] }
    saveRecords([...records, record])
  }
  
  return record
}

export function toggleHabitCompletion(habitId: string): void {
  const records = getRecords()
  const today = new Date().toISOString().split('T')[0]
  const recordIndex = records.findIndex(r => r.date === today)
  
  if (recordIndex === -1) {
    const newRecord: DayRecord = { date: today, completedHabitIds: [habitId] }
    saveRecords([...records, newRecord])
  } else {
    const record = records[recordIndex]
    const isCompleted = record.completedHabitIds.includes(habitId)
    
    if (isCompleted) {
      record.completedHabitIds = record.completedHabitIds.filter(id => id !== habitId)
    } else {
      record.completedHabitIds.push(habitId)
    }
    
    records[recordIndex] = record
    saveRecords(records)
  }
}

export function getHabitStreak(habitId: string): number {
  const records = getRecords().sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - i)
    const expectedDateStr = expectedDate.toISOString().split('T')[0]
    
    if (record.date !== expectedDateStr) break
    if (record.completedHabitIds.includes(habitId)) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}