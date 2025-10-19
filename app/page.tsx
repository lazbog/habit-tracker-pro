'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Habit } from '@/lib/types'
import { getHabits, saveHabits } from '@/lib/storage'
import HabitItem from '@/components/HabitItem'
import HabitForm from '@/components/HabitForm'

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  useEffect(() => {
    const loadedHabits = getHabits()
    setHabits(loadedHabits)
  }, [])

  const handleAddHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
    }
    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
    setShowForm(false)
  }

  const handleEditHabit = (updatedHabit: Habit) => {
    const updatedHabits = habits.map(h => 
      h.id === updatedHabit.id ? updatedHabit : h
    )
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
    setEditingHabit(null)
    setShowForm(false)
  }

  const handleDeleteHabit = (id: string) => {
    const updatedHabits = habits.filter(h => h.id !== id)
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const handleToggleHabit = (id: string, date: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
        return { ...habit, completedDates }
      }
      return habit
    })
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Habit Tracker Pro</h1>
            <p className="text-muted-foreground mt-2">Build better habits, one day at a time</p>
          </div>
          <button
            onClick={() => {
              setEditingHabit(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <HabitForm
              habit={editingHabit}
              onSubmit={editingHabit ? handleEditHabit : handleAddHabit}
              onCancel={() => {
                setShowForm(false)
                setEditingHabit(null)
              }}
            />
          </div>
        )}

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabit}
                onEdit={handleEditClick}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <a
            href="/stats"
            className="text-primary hover:underline"
          >
            View Statistics →
          </a>
        </div>
      </div>
    </div>
  )
}