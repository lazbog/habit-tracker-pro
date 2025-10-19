'use client'

import React from 'react'
import { HabitProvider, useHabits } from '@/context/HabitContext'

function StatsContent() {
  const { habits } = useHabits()
  
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const getCompletedCount = (habit: any, startDate: string) => {
    return habit.completedDates.filter((date: string) => date >= startDate).length
  }

  const getWeeklyCompletion = (habit: any) => {
    const totalDays = 7
    const completed = getCompletedCount(habit, weekAgo)
    return (completed / totalDays) * 100
  }

  const getMonthlyCompletion = (habit: any) => {
    const totalDays = 30
    const completed = getCompletedCount(habit, monthAgo)
    return (completed / totalDays) * 100
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h2>
        <p className="text-gray-600">Track your progress and build consistency</p>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data to display</h3>
          <p className="text-gray-600">Start tracking habits to see your statistics here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Habits</h3>
              <p className="text-3xl font-bold text-gray-900">{habits.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Today</h3>
              <p className="text-3xl font-bold text-gray-900">
                {habits.filter(habit => habit.completedDates.includes(today)).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Progress</h3>
              <p className="text-3xl font-bold text-gray-900">
                {habits.length > 0 
                  ? Math.round((habits.filter(habit => habit.completedDates.includes(today)).length / habits.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Habit Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {habits.map((habit) => {
                  const weeklyCompletion = getWeeklyCompletion(habit)
                  const monthlyCompletion = getMonthlyCompletion(habit)
                  
                  return (
                    <div key={habit.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                          <h4 className="font-medium text-gray-900">{habit.name}</h4>
                        </div>
                        <span className="text-sm text-gray-500">
                          {habit.completedDates.length} days total
                        </span>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">This Week</span>
                            <span className="font-medium text-gray-900">
                              {Math.round(weeklyCompletion)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${weeklyCompletion}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">This Month</span>
                            <span className="font-medium text-gray-900">
                              {Math.round(monthlyCompletion)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${monthlyCompletion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StatsPage() {
  return (
    <HabitProvider>
      <StatsContent />
    </HabitProvider>
  )
}