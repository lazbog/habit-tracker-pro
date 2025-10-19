'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { addHabit, getHabitsWithRecords } from '@/lib/habits'
import { HabitFormData, HabitWithRecords } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import HabitForm from '@/components/HabitForm'
import HabitList from '@/components/HabitList'
import HabitCalendar from '@/components/HabitCalendar'
import HabitStats from '@/components/HabitStats'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [habits, setHabits] = useState<HabitWithRecords[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)

  const loadHabits = () => {
    setHabits(getHabitsWithRecords(formatDate(selectedDate)))
  }

  useEffect(() => {
    loadHabits()
  }, [selectedDate])

  const handleCreateHabit = (data: HabitFormData) => {
    addHabit(data)
    setShowForm(false)
    loadHabits()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Habit Tracker Pro</h1>
              <p className="text-muted-foreground mt-1">
                Build consistency, one day at a time
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Habit
            </button>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Selected Date:</span>
            <span className="font-medium text-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
              <HabitList
                habits={habits}
                selectedDate={formatDate(selectedDate)}
                onHabitsChange={loadHabits}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <HabitStats />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Calendar</h2>
              <HabitCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <HabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}