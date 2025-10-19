'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Check, Trash2, Plus } from 'lucide-react'
import { Habit, HabitRecord } from '../lib/types'
import { getHabits, getRecords, toggleHabitCompletion, deleteHabit } from '../lib/habits'
import HabitForm from './HabitForm'

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [records, setRecords] = useState<HabitRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    setHabits(getHabits())
    setRecords(getRecords())
  }, [])

  const refreshData = () => {
    setHabits(getHabits())
    setRecords(getRecords())
  }

  const handleToggleHabit = (habitId: string) => {
    toggleHabitCompletion(habitId, selectedDate)
    refreshData()
  }

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId)
      refreshData()
    }
  }

  const handleAddHabit = (data: { name: string; description: string; color: string; icon: string }) => {
    const { addHabit } = require('../lib/habits')
    addHabit(data)
    refreshData()
    setShowForm(false)
  }

  const isHabitCompleted = (habitId: string) => {
    return records.some(r => r.habitId === habitId && r.date === selectedDate && r.completed)
  }

  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = isHabitCompleted(a.id)
    const bCompleted = isHabitCompleted(b.id)
    return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1
  })

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Daily Habits</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={format(new Date(), 'yyyy-MM-dd')}
          className="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {sortedHabits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No habits yet. Start building better habits!</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedHabits.map((habit) => {
            const isCompleted = isHabitCompleted(habit.id)
            return (
              <div
                key={habit.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-secondary/50 border-secondary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <button
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                </button>

                <div className={`w-10 h-10 rounded-md ${habit.color} flex items-center justify-center text-2xl`}>
                  {habit.icon}
                </div>

                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}