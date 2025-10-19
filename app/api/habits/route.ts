import { NextRequest, NextResponse } from 'next/server'
import { Habit } from '@/lib/types'

let habits: Habit[] = []

export async function GET() {
  return NextResponse.json(habits)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      completedDates: [],
      currentStreak: 0,
    }
    
    habits.push(newHabit)
    
    return NextResponse.json(newHabit, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    const index = habits.findIndex(habit => habit.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    
    habits[index] = { ...habits[index], ...data }
    
    return NextResponse.json(habits[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const index = habits.findIndex(habit => habit.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    
    habits.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}