'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { getHabitsWithRecords } from '@/lib/habits'
import { cn } from '@/lib/utils'

interface HabitCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export default function HabitCalendar({ selectedDate, onDateSelect }: HabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const habits = getHabitsWithRecords()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const getDayCompletion = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayRecords = habits.flatMap(habit => 
      habit.records.filter(record => record.date === dateStr)
    )
    
    if (dayRecords.length === 0) return null
    
    const completed = dayRecords.filter(record => record.completed).length
    const total = habits.length
    
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day) => {
          const completion = getDayCompletion(day)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isTodayDate = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-md text-sm transition-all relative',
                !isCurrentMonth && 'text-muted-foreground/50',
                isSelected && 'ring-2 ring-primary ring-offset-2',
                isTodayDate && !isSelected && 'bg-secondary',
                'hover:bg-accent'
              )}
            >
              <span className={cn(
                'font-medium',
                isSelected && 'text-primary'
              )}>
                {format(day, 'd')}
              </span>
              
              {completion && (
                <div className="flex gap-0.5 mt-1">
                  {completion.total > 0 && (
                    <div
                      className={cn(
                        'h-1 rounded-full',
                        completion.percentage === 100
                          ? 'w-3 bg-green-500'
                          : completion.percentage >= 50
                          ? 'w-2 bg-yellow-500'
                          : 'w-1 bg-red-500'
                      )}
                    />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>100%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>50-99%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>&lt;50%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}