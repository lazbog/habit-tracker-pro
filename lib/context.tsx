'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Habit, HabitFormData } from './types'
import { generateId, calculateStreak, getCompletionRate } from './utils'

type HabitAction =
  | { type: 'ADD_HABIT'; payload: HabitFormData }
  | { type: 'UPDATE_HABIT'; payload: { id: string; data: Partial<HabitFormData> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT'; payload: string }
  | { type: 'LOAD_HABITS'; payload: Habit[] }

interface HabitState {
  habits: Habit[]
}

const HabitContext = createContext<{
  state: HabitState
  addHabit: (data: HabitFormData) => void
  updateHabit: (id: string, data: Partial<HabitFormData>) => void
  deleteHabit: (id: string) => void
  toggleHabit: (id: string) => void
} | null>(null)

function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'ADD_HABIT': {
      const newHabit: Habit = {
        id: generateId(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        completedDates: [],
        currentStreak: 0,
      }
      return { habits: [...state.habits, newHabit] }
    }
    case 'UPDATE_HABIT': {
      return {
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.data }
            : habit
        ),
      }
    }
    case 'DELETE_HABIT': {
      return {
        habits: state.habits.filter(habit => habit.id !== action.payload),
      }
    }
    case 'TOGGLE_HABIT': {
      const today = new Date().toISOString().split('T')[0]
      return {
        habits: state.habits.map(habit => {
          if (habit.id === action.payload) {
            const isCompleted = habit.completedDates.includes(today)
            const completedDates = isCompleted
              ? habit.completedDates.filter(date => date !== today)
              : [...habit.completedDates, today]
            
            return {
              ...habit,
              completedDates,
              currentStreak: calculateStreak({ ...habit, completedDates }),
            }
          }
          return habit
        }),
      }
    }
    case 'LOAD_HABITS': {
      return { habits: action.payload }
    }
    default:
      return state
  }
}

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, { habits: [] })

  useEffect(() => {
    const stored = localStorage.getItem('habits')
    if (stored) {
      try {
        const habits = JSON.parse(stored)
        dispatch({ type: 'LOAD_HABITS', payload: habits })
      } catch (error) {
        console.error('Failed to load habits:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(state.habits))
  }, [state.habits])

  const addHabit = (data: HabitFormData) => {
    dispatch({ type: 'ADD_HABIT', payload: data })
  }

  const updateHabit = (id: string, data: Partial<HabitFormData>) => {
    dispatch({ type: 'UPDATE_HABIT', payload: { id, data } })
  }

  const deleteHabit = (id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: id })
  }

  const toggleHabit = (id: string) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: id })
  }

  return (
    <HabitContext.Provider
      value={{
        state,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
}