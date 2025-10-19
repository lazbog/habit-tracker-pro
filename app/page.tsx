'use client'

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Circle, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HabitForm from '@/components/habit-form'
import HabitList from '@/components/habit-list'
import { storage } from '@/lib/storage'
import { Habit, HabitRecord } from '@/lib/types'
import Link from 'next/link'

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [habits, setHabits] = useState<Habit[]>([])
  const [records, setRecords] = useState<HabitRecord[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    percentage: 0,
  })

  useEffect(() => {
    refreshData()
  }, [selectedDate])

  const refreshData = () => {
    const allHabits = storage.getHabits()
    const allRecords = storage.getRecords()
    
    setHabits(allHabits)
    setRecords(allRecords)

    const todayRecords = allRecords.filter(r => r.date === selectedDate)
    const completed = todayRecords.filter(r => r.completed).length
    
    setStats({
      total: allHabits.length,
      completed,
      percentage: allHabits.length > 0 ? (completed / allHabits.length) * 100 : 0,
    })
  }

  const getStreak = (habitId: string): number => {
    const habitRecords = records
      .filter(r => r.habitId === habitId && r.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (habitRecords.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < habitRecords.length; i++) {
      const recordDate = new Date(habitRecords[i].date)
      recordDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (recordDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getWeeklyProgress = () => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekRecords = records.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate >= weekStart && r.completed
    })

    const uniqueDays = new Set(weekRecords.map(r => r.date)).size
    return uniqueDays
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                Habit Tracker Pro
              </h1>
              <p className="text-muted-foreground mt-1">
                Build consistency, track your progress
              </p>
            </div>
            <Link href="/stats">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Stats
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed Today</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Habits</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.percentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
            <HabitList
              selectedDate={selectedDate}
              onHabitsChange={refreshData}
            />
          </section>

          <section>
            <HabitForm onHabitAdded={refreshData} />
          </section>

          {habits.length > 0 && (
            <section className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Current Streaks</h3>
              <div className="space-y-2">
                {habits.map((habit) => {
                  const streak = getStreak(habit.id)
                  return (
                    <div key={habit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                        <span className="text-sm">{habit.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-orange-500"
                          />
                        ))}
                        <span className="text-sm font-medium text-orange-500 ml-2">
                          {streak} days
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This week</span>
                  <span className="text-sm font-medium">
                    {getWeeklyProgress()} active days
                  </span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}