'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'
import { Habit } from '@/lib/types'
import { getHabits } from '@/lib/storage'
import StatsCalendar from '@/components/StatsCalendar'

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabit, setSelectedHabit] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    const loadedHabits = getHabits()
    setHabits(loadedHabits)
  }, [])

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    let totalCompletions = 0
    let possibleCompletions = 0
    
    habits.forEach(habit => {
      if (selectedHabit === 'all' || habit.id === selectedHabit) {
        const recentCompletions = habit.completedDates.filter(date => 
          date >= thirtyDaysAgo && date <= today
        )
        totalCompletions += recentCompletions.length
        possibleCompletions += 30
      }
    })
    
    const completionRate = possibleCompletions > 0 
      ? Math.round((totalCompletions / possibleCompletions) * 100) 
      : 0
    
    return { totalCompletions, completionRate, possibleCompletions }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
            <p className="text-muted-foreground mt-2">Track your progress and stay motivated</p>
          </div>
          <a
            href="/"
            className="text-primary hover:underline"
          >
            ← Back to Habits
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Total Completions</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalCompletions}</p>
            <p className="text-muted-foreground text-sm mt-1">
              Last 30 days
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Completion Rate</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.completionRate}%</p>
            <p className="text-muted-foreground text-sm mt-1">
              {stats.totalCompletions} of {stats.possibleCompletions} completed
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Active Habits</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{habits.length}</p>
            <p className="text-muted-foreground text-sm mt-1">
              Total habits tracked
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Habit</label>
              <select
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Habits</option>
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Month</label>
              <input
                type="month"
                value={selectedMonth.toISOString().slice(0, 7)}
                onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
          {habits.length > 0 ? (
            <StatsCalendar
              habits={habits.filter(h => selectedHabit === 'all' || h.id === selectedHabit)}
              month={selectedMonth}
            />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No habits to display. Start by creating some habits!
            </p>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Habit Details</h3>
          {habits.length > 0 ? (
            <div className="space-y-4">
              {habits.map(habit => {
                const today = new Date().toISOString().split('T')[0]
                const isCompletedToday = habit.completedDates.includes(today)
                const streak = calculateStreak(habit.completedDates)
                
                return (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{habit.name}</h4>
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {isCompletedToday ? '✅ Completed Today' : '⏳ Not yet'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current Streak: {streak} days
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No habits to display. Start by creating some habits!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0
  
  const sortedDates = [...completedDates].sort((a, b) => b.localeCompare(a))
  const today = new Date().toISOString().split('T')[0]
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    
    if (sortedDates.includes(dateStr)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (i === 0) {
      break
    } else {
      break
    }
  }
  
  return streak
}