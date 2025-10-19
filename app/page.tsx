'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import HabitList from '@/components/HabitList'
import HabitForm from '@/components/HabitForm'
import { addHabit, updateHabit, getHabits } from '@/lib/habits'
import { HabitFormData } from '@/lib/types'

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<{ id: string; data: Partial<HabitFormData> } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateHabit = (data: HabitFormData) => {
    addHabit(data)
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  const handleUpdateHabit = (data: HabitFormData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data)
      setEditingHabit(null)
      setRefreshKey(prev => prev + 1)
    }
  }

  const startEdit = (habitId: string) => {
    const habits = getHabits()
    const habit = habits.find(h => h.id === habitId)
    if (habit) {
      setEditingHabit({
        id: habit.id,
        data: {
          name: habit.name,
          description: habit.description,
          color: habit.color
        }
      })
    }
  }

  useEffect(() => {
    if (editingHabit) {
      setShowForm(true)
    }
  }, [editingHabit])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Today's Habits</h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="mb-6">
        <HabitList key={refreshKey} />
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Habit
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          <HabitForm
            onEdit={handleUpdateHabit} onAdd={handleCreateHabit}
            onCancel={() => {
              setShowForm(false)
              setEditingHabit(null)
            }}
            initialData={editingHabit?.data}
          />
        </div>
      )}
    </div>
  )
}