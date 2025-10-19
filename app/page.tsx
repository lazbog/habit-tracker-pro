'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HabitCard } from '@/components/habit-card'
import { HabitForm } from '@/components/habit-form'
import { useHabits } from '@/lib/context'
import { Plus, BarChart3 } from 'lucide-react'

export default function HomePage() {
  const { state } = useHabits()
  const [showForm, setShowForm] = useState(false)
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  const completedToday = state.habits.filter(habit => {
    const todayStr = new Date().toISOString().split('T')[0]
    return habit.completedDates.includes(todayStr)
  }).length
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                Habit Tracker Pro
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {today}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/statistics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistics
                </Button>
              </Link>
              
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {state.habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              No habits yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start building better habits by creating your first one
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 p-4 bg-card rounded-lg border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {state.habits.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Habits</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {completedToday}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {Math.round((completedToday / state.habits.length) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Daily Progress</p>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {state.habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          </>
        )}
      </main>
      
      {showForm && (
        <HabitForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}