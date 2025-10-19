'use client'

import { useState } from 'react'
import { BarChart3, ListTodo } from 'lucide-react'
import HabitList from '../components/HabitList'
import StatsView from '../components/StatsView'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'habits' | 'stats'>('habits')

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Habit Tracker Pro</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('habits')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'habits'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                Habits
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Statistics
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {activeTab === 'habits' ? <HabitList /> : <StatsView />}
      </main>
    </div>
  )
}