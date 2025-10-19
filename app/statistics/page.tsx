'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useHabits } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Target, Calendar } from 'lucide-react'
import { format, subDays, startOfDay } from 'date-fns'

export default function StatisticsPage() {
  const { state } = useHabits()
  
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const completedToday = state.habits.filter(habit => 
      habit.completedDates.includes(today)
    ).length
    
    const totalStreaks = state.habits.reduce((sum, habit) => sum + habit.currentStreak, 0)
    const longestStreak = Math.max(...state.habits.map(habit => habit.currentStreak), 0)
    
    const totalCompletions = state.habits.reduce(
      (sum, habit) => sum + habit.completedDates.length,
      0
    )
    
    const avgCompletionRate = state.habits.length > 0
      ? Math.round(
          state.habits.reduce((sum, habit) => {
            const createdDate = new Date(habit.createdAt)
            const daysSinceCreation = Math.ceil(
              (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
            )
            return sum + (habit.completedDates.length / Math.max(daysSinceCreation, 1)) * 100
          }, 0) / state.habits.length
        )
      : 0
    
    return {
      totalHabits: state.habits.length,
      completedToday,
      totalStreaks,
      longestStreak,
      totalCompletions,
      avgCompletionRate,
    }
  }, [state.habits])
  
  const weeklyData = useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      const dayName = format(subDays(new Date(), i), 'EEE')
      const completed = state.habits.filter(habit => 
        habit.completedDates.includes(date)
      ).length
      
      data.push({
        date: dayName,
        completed,
        total: state.habits.length,
        percentage: state.habits.length > 0 ? Math.round((completed / state.habits.length) * 100) : 0,
      })
    }
    return data
  }, [state.habits])
  
  const habitPerformance = useMemo(() => {
    return state.habits
      .map(habit => ({
        name: habit.name,
        icon: habit.icon,
        completions: habit.completedDates.length,
        streak: habit.currentStreak,
        target: habit.targetStreak,
        color: habit.color,
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 5)
  }, [state.habits])
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  Statistics
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track your progress and performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-card-foreground">
                {stats.totalHabits}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Habits</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-card-foreground">
                {stats.totalCompletions}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Completions</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-card-foreground">
                {stats.longestStreak}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">%</span>
              </div>
              <span className="text-2xl font-bold text-card-foreground">
                {stats.avgCompletionRate}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Weekly Progress
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Top Performing Habits
            </h2>
            {habitPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={habitPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completions" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </div>
        </div>
        
        {habitPerformance.length > 0 && (
          <div className="mt-6 bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Habit Details
            </h2>
            <div className="space-y-3">
              {habitPerformance.map((habit) => (
                <div key={habit.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <p className="font-medium text-card-foreground">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {habit.completions} completions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">
                      {habit.streak} / {habit.target} days
                    </p>
                    <div className="w-24 bg-secondary rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((habit.streak / habit.target) * 100, 100)}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}