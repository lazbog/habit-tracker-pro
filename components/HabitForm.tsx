'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useHabits } from '@/lib/HabitContext'
import { HabitFormData } from '@/lib/types'

interface HabitFormProps {
  onSubmit?: () => void
  onCancel?: () => void
  initialData?: Partial<HabitFormData>
  editId?: string
}

const colors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
]

export default function HabitForm({ onSubmit, onCancel, initialData, editId }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabits()
  const [formData, setFormData] = useState<HabitFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || colors[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a habit name')
      return
    }

    if (editId) {
      updateHabit(editId, formData)
    } else {
      addHabit(formData)
    }
    
    onSubmit?.()
    
    if (!editId) {
      setFormData({
        name: '',
        description: '',
        color: colors[0],
      })
    }
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {onCancel && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Morning Exercise"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Optional description of your habit"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-8 h-8 rounded-full transition-all ${
                formData.color === color
                  ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {editId ? 'Update Habit' : 'Add Habit'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}