import { useState } from 'react'
import { X } from 'lucide-react'
import { Habit } from '@/lib/types'

interface HabitFormProps {
  habit?: Habit | null
  onSubmit: (habit: Omit<Habit, 'id'> | Habit) => void
  onCancel: () => void
}

export default function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '')
  const [description, setDescription] = useState(habit?.description || '')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return
    
    const habitData = {
      name: name.trim(),
      description: description.trim(),
      frequency,
      completedDates: habit?.completedDates || [],
      createdAt: habit?.createdAt || new Date().toISOString(),
    }
    
    if (habit) {
      onSubmit({ ...habitData, id: habit.id })
    } else {
      onSubmit(habitData)
    }
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {habit ? 'Edit Habit' : 'Create New Habit'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Habit Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Morning Exercise"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., 30 minutes of cardio and strength training"
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium mb-2">
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            {habit ? 'Update Habit' : 'Create Habit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}