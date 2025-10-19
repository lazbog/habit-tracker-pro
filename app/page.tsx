'use client'

import React, { useState } from 'react'
import { HabitProvider, useHabits } from '@/context/HabitContext'
import { Habit } from '@/lib/types'
import { HabitCard } from '@/components/HabitCard'
import { HabitForm } from '@/components/HabitForm'
import { Button } from '@/components/ui/Button'

function DashboardContent() {
  const { habits } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [habitToEdit, setHabitToEdit] = useState<Habit | undefined>()

  const handleEditHabit = (habit: Habit) => {
    setHabitToEdit(habit)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setHabitToEdit(undefined)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Habits</h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-6">Start building better habits by creating your first one.</p>
          <Button onClick={() => setShowForm(true)}>Create Your First Habit</Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Button onClick={() => setShowForm(true)}>
              + Add New Habit
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleEditHabit}
              />
            ))}
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
            </h3>
            <HabitForm 
              habitToEdit={habitToEdit}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <HabitProvider>
      <DashboardContent />
    </HabitProvider>
  )
}