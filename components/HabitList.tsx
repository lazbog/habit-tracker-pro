'use client'

import { useState } from 'react'
import { Check, X, Edit2, Trash2 } from 'lucide-react'
import { useHabits } from '@/lib/HabitContext'
import HabitForm from './HabitForm'

export default function HabitList() {
  const { habits, toggleHabitCompletion, deleteHabit } = useHabits()
  const [editingId, setEditingId] = useState<string | null>(null)
  const today = new Date().toISOString().split('T')[0]

  const handleToggle = (id: string) => {
    toggleHabitCompletion(id, today)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(id)
    }
  }

  const handleFormSubmit = () => {
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const isCompletedToday = habit.completedDates.includes(today)
        
        if (editingId === habit.id) {
          return (
            <div key={habit.id} className="bg-white p-6 rounded-lg shadow-sm">
              <HabitForm
                initialData={{
                  name: habit.name,
                  description: habit.description,
                  color: habit.color,
                }}
                onSubmit={handleFormSubmit}
                onCancel={() => setEditingId(null)}
                editId={habit.id}
              />
            </div>
          )
        }

        return (
          <div
            key={habit.id}
            className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all ${
              isCompletedToday ? 'border-green-500' : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                  {isCompletedToday && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Completed Today
                    </span>
                  )}
                </div>
                {habit.description && (
                  <p className="text-gray-600 mb-3">{habit.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created: {new Date(habit.createdAt).toLocaleDateString()}</span>
                  <span>Streak: {habit.completedDates.length} days</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggle(habit.id)}
                  className={`p-3 rounded-lg transition-colors ${
                    isCompletedToday
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-label={isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isCompletedToday ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => handleEdit(habit.id)}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Edit habit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  aria-label="Delete habit"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}