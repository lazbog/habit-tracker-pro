'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/storage'
import { Habit, HabitRecord, DailyStats, CategoryStats } from '@/lib/types'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [records, setRecords] = useState<HabitRecord[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allHabits = storage.getHabits()
    const allRecords = storage.getRecords()
    
    setHabits(allHabits)
    setRecords(allRecords)
    
    const daily = calculateDailyStats(allHabits, allRecords)
    setDailyStats(daily)
    
    const category = calculateCategoryStats(allHabits, allRecords)
    setCategoryStats(category)
  }

  const calculateDailyStats = (habits: Habit[], records: HabitRecord[]): DailyStats[] => {
    const today = new Date()
    const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365
    
    const stats: DailyStats[] = []
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayRecords = records.filter(r => r.date === dateStr)
      const completed = dayRecords.filter(r => r.completed).length
      
      stats.push({
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        completed,
        total: habits.length,
        percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0,
      })
    }
    
    return stats
  }

  const calculateCategoryStats = (habits: Habit[], records: HabitRecord[]): CategoryStats[] => {
    const categories = [...new Set(habits.map(h => h.category))]
    
    return categories.map(category => {
      const categoryHabits = habits.filter(h => h.category === category)
      const categoryRecords = records.filter(r => 
        categoryHabits.some(h => h.id === r.habitId)
      )
      const completed = categoryRecords.filter(r => r.completed).length
      
      return {
        category,
        completed,
        total: categoryRecords.length,
        percentage: categoryRecords.length > 0 ? (completed / categoryRecords.length) * 100 : 0,
      }
    })
  }

  const getOverallStats = () => {
    const totalHabits = habits.length
    const totalRecords = records.length
    const completedRecords = records.filter(r => r.completed).length
    const completionRate = totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0
    
    const uniqueDays = new Set(records.map(r => r.date)).size
    const activeDays = new Set(
      records.filter(r => r.completed).map(r => r.date)
    ).size
    
    return {
      totalHabits,
      totalRecords,
      completedRecords,
      completionRate,
      uniqueDays,
      activeDays,
    }
  }

  const stats = getOverallStats()
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  Statistics
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track your progress and analyze your habits
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.totalHabits}</div>
              <div className="text-sm text-muted-foreground">Total Habits</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.uniqueDays}</div>
              <div className="text-sm text-muted-foreground">Days Tracked</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.activeDays}</div>
              <div className="text-sm text-muted-foreground">Active Days</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.completedRecords}</div>
              <div className="text-sm text-muted-foreground">Completions</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold flex items-center gap-1">
                <TrendingUp className="h-5 w-5 text-green-500" />
                {dailyStats.length > 0 
                  ? dailyStats[dailyStats.length - 1]?.percentage.toFixed(0) 
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Today</div>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {dailyStats.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Daily Completion Rate</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Habits Completed per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {categoryStats.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="completed"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                <div className="space-y-3">
                  {categoryStats.map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{cat.percentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">
                          {cat.completed}/{cat.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {habits.length > 0 && (
            <section className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Habit Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Habit</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Target</th>
                      <th className="text-left py-2">Created</th>
                      <th className="text-left py-2">Total Completions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit) => {
                      const habitRecords = records.filter(r => r.habitId === habit.id)
                      const completions = habitRecords.filter(r => r.completed).length
                      
                      return (
                        <tr key={habit.id} className="border-b">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                              <span className="font-medium">{habit.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-muted-foreground">{habit.category}</td>
                          <td className="py-3">{habit.targetDays} days</td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(habit.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold text-green-600">
                              {completions}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              / {habitRecords.length}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {habits.length === 0 && (
            <section className="text-center py-12">
              <div className="text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No data to display</p>
                <p className="text-sm">Start tracking habits to see your statistics</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}