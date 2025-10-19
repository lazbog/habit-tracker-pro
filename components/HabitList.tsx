'use client'

import { useState, useEffect } from 'react'
import { Habit } from '@/lib/types'
import { getHabits, getTodayRecord, toggleHabitCompletion, deleteHabit } from '@/lib/habits'
import { Check, X, Edit2, Trash2 } from 'lucide-react'

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    setHabits(getHabits())
    setCompletedIds(getTodayRecord().completedHabitIds)
  }, [])

  const handleToggle = (habitId: string) => {
    toggleHabitCompletion(habitId)
    setCompletedIds(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    )
  }

  const handleDelete = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId)
      setHabits(getHabits())
      setCompletedIds(prev => prev.filter(id => id !== habitId))
    }
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No habits yet. Create your first habit!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const isCompleted = completedIds.includes(habit.id)
        
        return (
          <div
            key={habit.id}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
              isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
          >
            <button
              onClick={() => handleToggle(habit.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isCompleted && <Check className="w-4 h-4" />}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                  {habit.name}
                </h3>
              </div>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setEditingId(habit.id)}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}