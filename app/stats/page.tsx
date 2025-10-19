'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HabitProvider, useHabits } from '@/lib/HabitContext'
import StatsChart from '@/components/StatsChart'

function StatsPage() {
  const { habits } = useHabits()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        </div>
        <p className="text-gray-600">Track your progress and see your habit completion trends</p>
      </header>

      <main>
        {habits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No habits to display. Start tracking habits to see statistics!</p>
          </div>
        ) : (
          <div className="space-y-8">
            <StatsChart />
          </div>
        )}
      </main>
    </div>
  )
}

export default function Stats() {
  return (
    <HabitProvider>
      <StatsPage />
    </HabitProvider>
  )
}