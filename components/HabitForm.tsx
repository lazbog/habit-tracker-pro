'use client'

import React, { useState } from 'react'
import { Habit, HabitFormData } from '@/lib/types'
import { useHabits } from '@/context/HabitContext'
import { Button } from '@/components/ui/Button'

interface HabitFormProps {
  habitToEdit?: Habit
  onClose: () => void
}

const colors = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', 
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'
]

function HabitForm({ habitToEdit, onClose }: HabitFormProps) {
  const { addHabit, editHabit } = useHabits()
  const [formData, setFormData] = useState<HabitFormData>({
    name: habitToEdit?.name || '',
    description: habitToEdit?.description || '',
    color: habitToEdit?.color || colors[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) return

    if (habitToEdit) {
      editHabit(habitToEdit.id, formData)
    } else {
      addHabit(formData)
    }
    
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Drink 8 glasses of water"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Add more details about this habit..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                formData.color === color 
                  ? 'border-gray-900 scale-110' 
                  : 'border-gray-300 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <Button type="submit" className="flex-1">
          {habitToEdit ? 'Update Habit' : 'Create Habit'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default HabitForm
