'use client'

import React from 'react'
import { Habit } from '@/lib/types'
import { useHabits } from '@/context/HabitContext'
import { Button } from '@/components/ui/Button'

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
}

function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { deleteHabit, toggleHabitCompletion, isHabitCompletedToday } = useHabits()
  const isCompleted = isHabitCompletedToday(habit.id)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <h3 className="font-medium text-gray-900">{habit.name}</h3>
          </div>
          {habit.description && (
            <p className="mt-1 text-sm text-gray-600">{habit.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(habit)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Edit habit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => deleteHabit(habit.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete habit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={() => toggleHabitCompletion(habit.id)}
          variant={isCompleted ? 'secondary' : 'primary'}
          className="w-full"
        >
          {isCompleted ? '✓ Completed Today' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  )
}

export default HabitCard
