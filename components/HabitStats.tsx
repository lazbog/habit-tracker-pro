'use client'

import { Trophy, Target, TrendingUp, Calendar } from 'lucide-react'
import { getHabitsWithRecords, getWeeklyStats } from '@/lib/habits'
import { getStreakDays, getCompletionPercentage } from '@/lib/utils'
import { format, subDays, startOfWeek } from 'date-fns'

export default function HabitStats() {
  const habits = getHabitsWithRecords()
  
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = startOfWeek(new Date())
  const weekEnd = new Date()
  const weeklyStats = getWeeklyStats(weekStart, weekEnd)
  
  const totalHabits = habits.length
  const todayRecords = habits.flatMap(habit => 
    habit.records.filter(record => record.date === today)
  )
  const completedToday = todayRecords.filter(record => record.completed).length
  
  const totalRecords = habits.flatMap(habit => habit.records)
  const overallCompletion = getCompletionPercentage(totalRecords)
  
  const currentStreak = Math.max(
    ...habits.map(habit => getStreakDays(habit.records)),
    0
  )
  
  const weeklyCompletion = weeklyStats.length > 0
    ? Math.round(weeklyStats.reduce((acc, day) => acc + day.percentage, 0) / weeklyStats.length)
    : 0

  const stats = [
    {
      label: 'Total Habits',
      value: totalHabits.toString(),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Today\'s Progress',
      value: totalHabits > 0 ? `${Math.round((completedToday / totalHabits) * 100)}%` : '0%',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Weekly Average',
      value: `${weeklyCompletion}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <Icon className={cn('w-4 h-4', stat.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}