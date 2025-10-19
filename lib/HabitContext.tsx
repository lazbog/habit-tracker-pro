'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Habit, HabitFormData } from './types'

interface HabitContextType {
  habits: Habit[]
  addHabit: (habit: HabitFormData) => void
  updateHabit: (id: string, habit: HabitFormData) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string, date: string) => void
  getHabitCompletionRate: (habitId: string, days: number) => number
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits')
    if (storedHabits) {
      try {
        setHabits(JSON.parse(storedHabits))
      } catch (error) {
        console.error('Error parsing habits from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = (habitData: HabitFormData) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: new Date().toISOString(),
      completedDates: [],
    }
    setHabits([...habits, newHabit])
  }

  const updateHabit = (id: string, habitData: HabitFormData) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, ...habitData } : habit
    ))
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id))
  }

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(date)
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== date)
            : [...habit.completedDates, date]
        }
      }
      return habit
    }))
  }

  const getHabitCompletionRate = (habitId: string, days: number): number => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return 0

    const today = new Date()
    const dates: string[] = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    const completedCount = dates.filter(date => 
      habit.completedDates.includes(date)
    ).length

    return (completedCount / days) * 100
  }

  return (
    <HabitContext.Provider value={{
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitCompletion,
      getHabitCompletionRate,
    }}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
}