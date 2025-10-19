import { NextRequest, NextResponse } from 'next/server'
import { getHabits, addHabit, deleteHabit } from '../../../lib/habits'

export async function GET() {
  try {
    const habits = getHabits()
    return NextResponse.json(habits)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color, icon } = body
    
    if (!name || !color || !icon) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const habit = addHabit({ name, description, color, icon })
    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 })
    }
    
    deleteHabit(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 })
  }
}