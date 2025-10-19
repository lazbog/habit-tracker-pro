'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { storage } from '@/lib/storage'
import { Habit, HabitWithRecords } from '@/lib/types'

interface HabitListProps {
  selectedDate: string
  onHabitsChange?: () => void
}

export default function HabitList({ selectedDate, onHabitsChange }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    setHabits(storage.getHabits())
  }, [])

  const refreshHabits = () => {
    setHabits(storage.getHabits())
    onHabitsChange?.()
  }

  const toggleHabit = (habitId: string) => {
    storage.toggleRecord(habitId, selectedDate)
    onHabitsChange?.()
  }

  const deleteHabit = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      storage.deleteHabit(id)
      refreshHabits()
    }
  }

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id)
    setEditName(habit.name)
  }

  const saveEdit = () => {
    if (editName.trim() && editingId) {
      storage.updateHabit(editingId, { name: editName.trim() })
      refreshHabits()
    }
    setEditingId(null)
    setEditName('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const isCompleted = (habitId: string) => {
    const record = storage.getRecord(habitId, selectedDate)
    return record?.completed || false
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">No habits yet</p>
        <p className="text-sm">Create your first habit to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {habits.map((habit) => {
        const completed = isCompleted(habit.id)
        const isEditing = editingId === habit.id

        return (
          <div
            key={habit.id}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
              completed
                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                : 'bg-card'
            }`}
          >
            <button
              onClick={() => toggleHabit(habit.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all ${
                completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {completed && (
                <Check className="w-4 h-4 text-white mx-auto" />
              )}
            </button>

            <div className={`w-3 h-3 rounded-full ${habit.color}`} />

            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveEdit}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${
                      completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {habit.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Target: {habit.targetDays} days
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(habit)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}