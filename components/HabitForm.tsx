'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { HabitFormData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HabitFormProps {
  onSubmit: (data: HabitFormData) => void
  onCancel?: () => void
  initialData?: Partial<HabitFormData>
  isEditing?: boolean
}

const colors = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Teal', value: 'bg-teal-500' },
]

export default function HabitForm({ onSubmit, onCancel, initialData, isEditing = false }: HabitFormProps) {
  const [formData, setFormData] = useState<HabitFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    targetDays: initialData?.targetDays || 30,
    color: initialData?.color || 'bg-blue-500'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Optional description..."
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="targetDays" className="block text-sm font-medium mb-2">
              Target Days
            </label>
            <input
              type="number"
              id="targetDays"
              value={formData.targetDays}
              onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              min="1"
              max="365"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    color.value,
                    formData.color === color.value
                      ? 'ring-2 ring-ring ring-offset-2'
                      : 'hover:scale-110'
                  )}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isEditing ? 'Update Habit' : 'Create Habit'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}