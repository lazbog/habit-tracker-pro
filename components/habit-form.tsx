'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { storage } from '@/lib/storage'
import { Habit } from '@/lib/types'

interface HabitFormProps {
  onHabitAdded?: () => void
}

const categories = [
  'Health',
  'Fitness',
  'Learning',
  'Work',
  'Personal',
  'Social',
  'Creative',
  'Other',
]

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-gray-500',
]

export default function HabitForm({ onHabitAdded }: HabitFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Personal')
  const [color, setColor] = useState('bg-blue-500')
  const [targetDays, setTargetDays] = useState(30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      category,
      color,
      targetDays,
      createdAt: new Date().toISOString(),
    }

    storage.addHabit(newHabit)
    onHabitAdded?.()

    setName('')
    setDescription('')
    setCategory('Personal')
    setColor('bg-blue-500')
    setTargetDays(30)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add New Habit
      </Button>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Create New Habit</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter habit name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Target Days</label>
            <Input
              type="number"
              min="1"
              max="365"
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Color</label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full ${c} ${
                  color === c ? 'ring-2 ring-offset-2 ring-ring' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit">Create Habit</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}