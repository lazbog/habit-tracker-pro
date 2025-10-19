'use client'

import { useState } from 'react'
import { Plus, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { HabitProvider, useHabits } from '@/lib/HabitContext'
import HabitList from '@/components/HabitList'
import HabitForm from '@/components/HabitForm'

function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const { habits } = useHabits()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker Pro</h1>
          <Link
            href="/stats"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Stats
          </Link>
        </div>
        <p className="text-gray-600">Track your daily habits and build better routines</p>
      </header>

      <main>
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Habit
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <HabitForm
              onSubmit={(habit) => {
                setShowForm(false)
              }}
            />
          </div>
        )}

        {habits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 mb-4">No habits yet. Start by adding your first habit!</p>
          </div>
        ) : (
          <HabitList />
        )}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <HabitProvider>
      <HomePage />
    </HabitProvider>
  )
}