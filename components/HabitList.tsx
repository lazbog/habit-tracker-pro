'use client'

import { useState } from 'react'
import { Check, Edit2, Trash2 } from 'lucide-react'
import { HabitWithRecords } from '@/lib/types'
import { formatDate, getCompletionPercentage, getStreakDays } from '@/lib/utils'
import { toggleHabitRecord, deleteHabit } from '@/lib/habits'
import HabitForm from './HabitForm'
import { cn } from '@/lib/utils'

interface HabitListProps {
  habits: HabitWithRecords[]
  selectedDate: string
  onHabitsChange: () => void
}

export default function HabitList({ habits, selectedDate, onHabitsChange }: HabitListProps) {
  const [editingHabit, setEditingHabit] = useState<HabitWithRecords | null>(null)

  const handleToggle = (habitId: string) => {
    toggleHabitRecord(habitId, selectedDate)
    onHabitsChange()
  }

  const handleDelete = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId)
      onHabitsChange()
    }
  }

  const handleEdit = (habit: HabitWithRecords) => {
    setEditingHabit(habit)
  }

  const handleEditSubmit = (data: any) => {
    if (editingHabit) {
      // Update logic would go here
      setEditingHabit(null)
      onHabitsChange()
    }
  }

  const todayRecords = habits.map(habit => ({
    habitId: habit.id,
    completed: habit.records.some(r => r.date === selectedDate && r.completed)
  }))

  const completedToday = todayRecords.filter(r => r.completed).length
  const totalHabits = habits.length

  return (
    <>
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Today's Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedToday}/{totalHabits} completed
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => {
                const isCompleted = habit.records.some(
                  (record) => record.date === selectedDate && record.completed
                )
                const completionPercentage = getCompletionPercentage(habit.records)
                const streakDays = getStreakDays(habit.records)

                return (
                  <div
                    key={habit.id}
                    className={cn(
                      'bg-card rounded-lg p-4 border transition-all hover:shadow-md',
                      isCompleted && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggle(habit.id)}
                        className={cn(
                          'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                          isCompleted
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground hover:border-primary'
                        )}
                      >
                        {isCompleted && <Check className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{habit.name}</h3>
                            {habit.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {habit.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(habit)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(habit.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className={cn('w-2 h-2 rounded-full', habit.color)} />
                            {completionPercentage}% complete
                          </span>
                          <span>{streakDays} day streak</span>
                          <span>Target: {habit.targetDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {editingHabit && (
        <HabitForm
          initialData={editingHabit}
          isEditing={true}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingHabit(null)}
        />
      )}
    </>
  )
}