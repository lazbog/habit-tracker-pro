'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useHabits } from '@/lib/HabitContext'

export default function StatsChart() {
  const { habits, getHabitCompletionRate } = useHabits()

  const last7DaysData = useMemo(() => {
    const data = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayName = date.toLocaleDateString('en', { weekday: 'short' })
      
      const completedCount = habits.filter(habit => 
        habit.completedDates.includes(dateStr)
      ).length
      
      data.push({
        day: dayName,
        date: dateStr,
        completed: completedCount,
        total: habits.length,
      })
    }
    
    return data
  }, [habits])

  const habitCompletionRates = useMemo(() => {
    return habits.map(habit => ({
      name: habit.name,
      rate: getHabitCompletionRate(habit.id, 30),
      color: habit.color,
    })).sort((a, b) => b.rate - a.rate)
  }, [habits, getHabitCompletionRate])

  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0)
  const averageCompletionRate = habits.length > 0
    ? habitCompletionRates.reduce((sum, habit) => sum + habit.rate, 0) / habits.length
    : 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Habits</h3>
          <p className="text-3xl font-bold text-gray-900">{habits.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Completions</h3>
          <p className="text-3xl font-bold text-gray-900">{totalCompletions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Completion Rate (30 days)</h3>
          <p className="text-3xl font-bold text-gray-900">{averageCompletionRate.toFixed(1)}%</p>
        </div>
      </div>

      {habits.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Last 7 Days Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium">{data.day}</p>
                          <p className="text-sm text-gray-600">
                            {data.completed} of {data.total} habits completed
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Habit Performance (30 days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitCompletionRates} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-gray-600">
                            {data.rate.toFixed(1)}% completion rate
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="rate" fill="#22c55e" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {habitCompletionRates.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Completion Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={habitCompletionRates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.rate.toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="rate"
                  >
                    {habitCompletionRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}