'use client'

import { useState, useMemo } from 'react'
import { getRecords, getHabits } from '@/lib/habits'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  selectedMonth?: Date
}

export default function Calendar({ selectedMonth: initialMonth }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date())
  const habits = getHabits()
  const records = getRecords()

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return { firstDay, lastDay, days }
  }, [currentMonth])

  const getDayData = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const record = records.find(r => r.date === dateStr)
    const totalHabits = habits.length
    const completed = record ? record.completedHabitIds.length : 0
    const percentage = totalHabits > 0 ? (completed / totalHabits) * 100 : 0
    
    return { completed, total: totalHabits, percentage, isCurrentMonth: date.getMonth() === currentMonth.getMonth() }
  }

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-lg font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {monthData.days.map((date, index) => {
          const { completed, total, percentage, isCurrentMonth } = getDayData(date)
          const isToday = date.toDateString() === new Date().toDateString()
          
          let bgColor = 'bg-gray-100'
          if (percentage === 100 && total > 0) bgColor = 'bg-green-500'
          else if (percentage >= 75 && total > 0) bgColor = 'bg-green-400'
          else if (percentage >= 50 && total > 0) bgColor = 'bg-yellow-400'
          else if (percentage >= 25 && total > 0) bgColor = 'bg-orange-400'
          else if (percentage > 0 && total > 0) bgColor = 'bg-red-400'
          
          return (
            <div
              key={index}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`absolute inset-0 rounded-lg ${bgColor} opacity-20`} />
              <span className="relative z-10 font-medium">{date.getDate()}</span>
              {total > 0 && (
                <span className="relative z-10 text-xs">
                  {completed}/{total}
                </span>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-400 rounded" />
          <span>75%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded" />
          <span>50%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-400 rounded" />
          <span>25%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded" />
          <span>&lt;25%</span>
        </div>
      </div>
    </div>
  )
}