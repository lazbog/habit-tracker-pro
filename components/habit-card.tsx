'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Habit } from '@/lib/types'
import { useHabits } from '@/lib/context'
import { isToday } from '@/lib/utils'
import { Check, Edit2, Trash2 } from 'lucide-react'
import { HabitForm } from './habit-form'

interface HabitCardProps {
  habit: Habit
}

function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabit, deleteHabit } = useHabits()
  const [showEditForm, setShowEditForm] = useState(false)
  
  const isCompletedToday = isToday(habit.completedDates[habit.completedDates.length - 1])
  const completionPercentage = Math.min((habit.currentStreak / habit.targetStreak) * 100, 100)
  
  const handleToggle = () => {
    toggleHabit(habit.id)
  }
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id)
    }
  }
  
  return (
    <>
      <div className="bg-card rounded-lg border p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${habit.color}20` }}
            >
              {habit.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditForm(true)}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Current Streak
            </span>
            <span className="font-medium">
              {habit.currentStreak} / {habit.targetStreak} days
            </span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${completionPercentage}%`,
                backgroundColor: habit.color,
              }}
            />
          </div>
        </div>
        
        <Button
          onClick={handleToggle}
          variant={isCompletedToday ? "secondary" : "default"}
          className="w-full"
        >
          {isCompletedToday ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Completed Today
            </>
          ) : (
            'Mark as Complete'
          )}
        </Button>
      </div>
      
      {showEditForm && (
        <HabitForm
          onClose={() => setShowEditForm(false)}
          initialData={{
            name: habit.name,
            description: habit.description,
            color: habit.color,
            icon: habit.icon,
            targetStreak: habit.targetStreak,
          }}
          habitId={habit.id}
        />
      )}
    </>
  )
}

export default HabitCard
