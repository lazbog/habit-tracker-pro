import { NextResponse } from 'next/server'
import { getHabits, getHabitStats, getChartData } from '../../../lib/habits'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const habits = getHabits()
    const stats = habits.map(habit => getHabitStats(habit.id))
    const chartData = getChartData(days)
    
    return NextResponse.json({
      habits: stats,
      chartData,
      summary: {
        totalHabits: habits.length,
        totalCompletionRate: stats.length > 0
          ? Math.round(stats.reduce((sum, stat) => sum + stat.completionRate, 0) / stats.length)
          : 0,
        totalStreak: stats.reduce((sum, stat) => sum + stat.streak, 0),
        totalCompletedDays: stats.reduce((sum, stat) => sum + stat.completedDays, 0),
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}