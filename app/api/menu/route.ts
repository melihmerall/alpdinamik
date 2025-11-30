import { NextResponse } from 'next/server'
import { getActiveRepresentatives } from '@/lib/content'

export async function GET() {
  try {
    const representatives = await getActiveRepresentatives()
    return NextResponse.json(representatives)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

