import { useState } from 'react'
import { Check, Edit2, Trash2, Calendar } from 'lucide-react'
import { Habit } from '@/lib/types'

interface HabitItemProps {
  habit: Habit
  onToggle: (id: string, date: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

export default function HabitItem({ habit, onToggle, onEdit, onDelete }: HabitItemProps) {
  const [showRecent, setShowRecent] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = habit.completedDates.includes(today)
  
  const recentDates = habit.completedDates
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7)
  
  const streak = calculateStreak(habit.completedDates)

  return (
    <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onToggle(habit.id, today)}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                isCompletedToday
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground hover:border-primary'
              }`}
            >
              {isCompletedToday && <Check className="w-4 h-4" />}
            </button>
            <h3 className={`text-lg font-semibold ${
              isCompletedToday ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {habit.name}
            </h3>
          </div>
          
          <p className="text-muted-foreground mb-3 ml-9">{habit.description}</p>
          
          <div className="flex items-center gap-4 ml-9">
            <span className="text-sm text-muted-foreground">
              Current Streak: <span className="font-medium text-foreground">{streak} days</span>
            </span>
            
            <button
              onClick={() => setShowRecent(!showRecent)}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Calendar className="w-4 h-4" />
              {showRecent ? 'Hide' : 'Show'} Recent
            </button>
          </div>
          
          {showRecent && recentDates.length > 0 && (
            <div className="mt-3 ml-9">
              <p className="text-sm text-muted-foreground mb-2">Recent completions:</p>
              <div className="flex flex-wrap gap-2">
                {recentDates.map(date => (
                  <span
                    key={date}
                    className="px-2 py-1 bg-muted text-xs rounded-md"
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Edit habit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Delete habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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