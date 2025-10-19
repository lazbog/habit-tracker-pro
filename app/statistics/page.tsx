'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Calendar from '@/components/Calendar'
import { getHabits, getRecords, getHabitStreak } from '@/lib/habits'
import { TrendingUp, Target, Flame } from 'lucide-react'

export default function StatisticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const habits = getHabits()
  const records = getRecords()

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = records.find(r => r.date === today)
    const todayCompleted = todayRecord ? todayRecord.completedHabitIds.length : 0
    
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const record = records.find(r => r.date === dateStr)
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: record ? record.completedHabitIds.length : 0,
        total: habits.length
      })
    }
    
    const habitStats = habits.map(habit => ({
      ...habit,
      streak: getHabitStreak(habit.id),
      totalCompletions: records.reduce((acc, record) => 
        acc + (record.completedHabitIds.includes(habit.id) ? 1 : 0), 0
      )
    }))
    
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthRecords = records.filter(r => new Date(r.date) >= thisMonth)
    const monthlyCompletions = thisMonthRecords.reduce((acc, record) => 
      acc + record.completedHabitIds.length, 0
    )
    
    return {
      todayCompleted,
      totalHabits: habits.length,
      weeklyData: last7Days,
      habitStats,
      monthlyCompletions
    }
  }, [habits, records])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Statistics</h2>
        <p className="text-gray-600">Track your progress and build consistency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Today's Progress</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">
            {stats.todayCompleted}/{stats.totalHabits}
          </p>
          <p className="text-sm text-gray-600 mt-1">habits completed</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{stats.monthlyCompletions}</p>
          <p className="text-sm text-gray-600 mt-1">total completions</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Best Streak</h3>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">
            {Math.max(...stats.habitStats.map(h => h.streak), 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">days in a row</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Habit Streaks</h3>
          <div className="space-y-3">
            {stats.habitStats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No habits yet</p>
            ) : (
              stats.habitStats.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {habit.totalCompletions} total
                    </span>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">{habit.streak}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
        <Calendar selectedMonth={selectedMonth} />
      </div>
    </div>
  )
}