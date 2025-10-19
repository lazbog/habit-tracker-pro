'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react'
import { getHabits, getHabitStats, getChartData } from '../lib/habits'
import { HabitStats } from '../lib/types'

export default function StatsView() {
  const [habitsStats, setHabitsStats] = useState<HabitStats[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30')

  useEffect(() => {
    const habits = getHabits()
    const stats = habits.map(habit => getHabitStats(habit.id))
    setHabitsStats(stats)
    setChartData(getChartData(parseInt(timeRange)))
  }, [timeRange])

  const totalCompletionRate = habitsStats.length > 0
    ? Math.round(habitsStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habitsStats.length)
    : 0

  const totalStreak = habitsStats.reduce((sum, stat) => sum + stat.streak, 0)
  const totalCompletedDays = habitsStats.reduce((sum, stat) => sum + stat.completedDays, 0)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>

      <div className="mb-6">
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Overall Completion</span>
          </div>
          <p className="text-2xl font-bold">{totalCompletionRate}%</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total Streak</span>
          </div>
          <p className="text-2xl font-bold">{totalStreak} days</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Completed Days</span>
          </div>
          <p className="text-2xl font-bold">{totalCompletedDays}</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Active Habits</span>
          </div>
          <p className="text-2xl font-bold">{habitsStats.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Completion Rate Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Habit Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={habitsStats.map(stat => ({ name: stat.habitName, rate: stat.completionRate }))}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="rate" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Individual Habit Stats</h2>
        </div>
        <div className="divide-y">
          {habitsStats.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No habits to display. Start tracking your habits to see statistics here.
            </div>
          ) : (
            habitsStats.map((stat) => (
              <div key={stat.habitId} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{stat.habitName}</h3>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{stat.streak} day streak</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Completion Rate</p>
                    <p className="font-semibold">{stat.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completed Days</p>
                    <p className="font-semibold">{stat.completedDays} / {stat.totalDays}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Streak</p>
                    <p className="font-semibold">{stat.streak} days</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${stat.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}