'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Habit, HabitFormData } from '@/lib/types'
import { getHabits, saveHabits, completeHabit, uncompleteHabit } from '@/lib/storage'

interface HabitContextType {
  habits: Habit[]
  addHabit: (data: HabitFormData) => void
  editHabit: (id: string, data: HabitFormData) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string) => void
  isHabitCompletedToday: (id: string) => boolean
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    setHabits(getHabits())
  }, [])

  const addHabit = (data: HabitFormData) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      completedDates: []
    }
    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const editHabit = (id: string, data: HabitFormData) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { ...habit, ...data } : habit
    )
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id)
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const toggleHabitCompletion = (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (habit) {
      const today = new Date().toISOString().split('T')[0]
      const isCompleted = habit.completedDates.includes(today)
      
      if (isCompleted) {
        uncompleteHabit(id)
        setHabits(getHabits())
      } else {
        completeHabit(id)
        setHabits(getHabits())
      }
    }
  }

  const isHabitCompletedToday = (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return false
    
    const today = new Date().toISOString().split('T')[0]
    return habit.completedDates.includes(today)
  }

  return (
    <HabitContext.Provider value={{
      habits,
      addHabit,
      editHabit,
      deleteHabit,
      toggleHabitCompletion,
      isHabitCompletedToday
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