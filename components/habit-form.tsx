'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { useHabits } from '@/lib/context'
import { HabitFormData } from '@/lib/types'
import { X } from 'lucide-react'

interface HabitFormProps {
  onClose: () => void
  initialData?: HabitFormData
  habitId?: string
}

const colors = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', 
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
]

const icons = ['🎯', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎨', '🎵', '🚀']

function HabitForm({ onClose, initialData, habitId }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabits()
  const [formData, setFormData] = useState<HabitFormData>(
    initialData || {
      name: '',
      description: '',
      color: colors[0],
      icon: icons[0],
      targetStreak: 30,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) return

    if (habitId && initialData) {
      updateHabit(habitId, formData)
    } else {
      addHabit(formData)
    }
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {habitId ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter habit name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter habit description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-2 text-2xl rounded-md border-2 transition-colors ${
                    formData.icon === icon
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full h-10 rounded-md border-2 transition-all ${
                    formData.color === color
                      ? 'border-primary scale-110'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Streak (days)
            </label>
            <input
              type="number"
              value={formData.targetStreak}
              onChange={(e) => setFormData({ ...formData, targetStreak: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              max="365"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {habitId ? 'Update' : 'Create'} Habit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitForm
