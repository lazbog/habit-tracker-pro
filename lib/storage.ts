import { Habit, HabitRecord } from './types'

const STORAGE_KEYS = {
  HABITS: 'habit-tracker-habits',
  RECORDS: 'habit-tracker-records',
}

export const storage = {
  getHabits: (): Habit[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.HABITS)
    return data ? JSON.parse(data) : []
  },

  saveHabits: (habits: Habit[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
  },

  getRecords: (): HabitRecord[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS)
    return data ? JSON.parse(data) : []
  },

  saveRecords: (records: HabitRecord[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records))
  },

  addHabit: (habit: Habit): void => {
    const habits = storage.getHabits()
    habits.push(habit)
    storage.saveHabits(habits)
  },

  updateHabit: (id: string, updates: Partial<Habit>): void => {
    const habits = storage.getHabits()
    const index = habits.findIndex(h => h.id === id)
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates }
      storage.saveHabits(habits)
    }
  },

  deleteHabit: (id: string): void => {
    const habits = storage.getHabits()
    const filtered = habits.filter(h => h.id !== id)
    storage.saveHabits(filtered)
    
    const records = storage.getRecords()
    const filteredRecords = records.filter(r => r.habitId !== id)
    storage.saveRecords(filteredRecords)
  },

  toggleRecord: (habitId: string, date: string): void => {
    const records = storage.getRecords()
    const existingIndex = records.findIndex(r => r.habitId === habitId && r.date === date)
    
    if (existingIndex !== -1) {
      records[existingIndex].completed = !records[existingIndex].completed
    } else {
      records.push({
        id: crypto.randomUUID(),
        habitId,
        date,
        completed: true,
      })
    }
    
    storage.saveRecords(records)
  },

  getRecord: (habitId: string, date: string): HabitRecord | undefined => {
    const records = storage.getRecords()
    return records.find(r => r.habitId === habitId && r.date === date)
  },
}