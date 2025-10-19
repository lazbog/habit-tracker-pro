'use client';

import { Habit, HabitRecord, HabitStats, DailyStats, ChartData } from './types'
import { format, subDays, startOfDay, isAfter } from 'date-fns'

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

export function addHabit(habit: Omit<Habit, 'id' | 'createdAt'>): Habit {
  const newHabit: Habit = {
    ...habit,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const habits = getHabits()
  saveHabits([...habits, newHabit])
  return newHabit
}

export function deleteHabit(id: string): void {
  const habits = getHabits().filter(h => h.id !== id)
  saveHabits(habits)
  
  const records = getRecords().filter(r => r.habitId !== id)
  saveRecords(records)
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

export function toggleHabitCompletion(habitId: string, date: string): HabitRecord {
  const records = getRecords()
  const existingRecord = records.find(r => r.habitId === habitId && r.date === date)
  
  if (existingRecord) {
    const updatedRecords = records.map(r => 
      r.habitId === habitId && r.date === date 
        ? { ...r, completed: !r.completed }
        : r
    )
    saveRecords(updatedRecords)
    return { ...existingRecord, completed: !existingRecord.completed }
  } else {
    const newRecord: HabitRecord = {
      id: crypto.randomUUID(),
      habitId,
      date,
      completed: true,
    }
    saveRecords([...records, newRecord])
    return newRecord
  }
}

export function getHabitStats(habitId: string): HabitStats {
  const habits = getHabits()
  const records = getRecords()
  const habit = habits.find(h => h.id === habitId)
  
  if (!habit) {
    return {
      habitId,
      habitName: 'Unknown',
      totalDays: 0,
      completedDays: 0,
      streak: 0,
      completionRate: 0,
    }
  }
  
  const habitRecords = records.filter(r => r.habitId === habitId)
  const habitCreationDate = startOfDay(new Date(habit.createdAt))
  const today = startOfDay(new Date())
  
  let totalDays = 0
  let currentDate = habitCreationDate
  
  while (!isAfter(currentDate, today)) {
    totalDays++
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
  }
  
  const completedDays = habitRecords.filter(r => r.completed).length
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0
  
  let streak = 0
  let checkDate = today
  
  while (true) {
    const record = habitRecords.find(r => r.date === format(checkDate, 'yyyy-MM-dd'))
    if (record && record.completed) {
      streak++
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
    } else {
      break
    }
  }
  
  return {
    habitId,
    habitName: habit.name,
    totalDays,
    completedDays,
    streak,
    completionRate,
  }
}

export function getDailyStats(days: number = 30): DailyStats[] {
  const records = getRecords()
  const habits = getHabits()
  const stats: DailyStats[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const dayRecords = records.filter(r => r.date === date)
    const totalHabits = habits.filter(h => !isAfter(new Date(habit.createdAt), new Date(date))).length
    const completedHabits = dayRecords.filter(r => r.completed).length
    
    stats.push({
      date,
      totalHabits,
      completedHabits,
      completionRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
    })
  }
  
  return stats
}

export function getChartData(days: number = 30): ChartData[] {
  const dailyStats = getDailyStats(days)
  return dailyStats.map(stat => ({
    date: format(new Date(stat.date), 'MMM dd'),
    completionRate: stat.completionRate,
  }))
}