import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns'
import { Habit } from '@/lib/types'

interface StatsCalendarProps {
  habits: Habit[]
  month: Date
}

export default function StatsCalendar({ habits, month }: StatsCalendarProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const startDayOfWeek = getDay(monthStart)
  const emptyDays = Array(startDayOfWeek).fill(null)
  
  const getCompletionStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(dateStr)
    )
    
    if (completedHabits.length === 0) return 'none'
    if (completedHabits.length === habits.length) return 'full'
    return 'partial'
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {monthDays.map(day => {
          const status = getCompletionStatus(day)
          const isToday = isSameDay(day, new Date())
          
          return (
            <div
              key={day.toISOString()}
              className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium relative ${
                !isSameMonth(day, month)
                  ? 'text-muted-foreground/30'
                  : 'text-foreground'
              } ${
                isToday ? 'ring-2 ring-primary' : ''
              } ${
                status === 'full'
                  ? 'bg-primary text-primary-foreground'
                  : status === 'partial'
                  ? 'bg-primary/30 text-foreground'
                  : 'bg-muted'
              }`}
              title={`${format(day, 'MMM d, yyyy')} - ${
                status === 'full' 
                  ? 'All habits completed'
                  : status === 'partial'
                  ? 'Some habits completed'
                  : 'No habits completed'
              }`}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded" />
          <span className="text-muted-foreground">All Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/30 rounded" />
          <span className="text-muted-foreground">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded" />
          <span className="text-muted-foreground">None</span>
        </div>
      </div>
    </div>
  )
}