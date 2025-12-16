import { NextResponse } from 'next/server'
import { getActiveRepresentatives } from '@/lib/content'

export async function GET() {
  try {
    const representatives = await getActiveRepresentatives()
    
    // Cache for 10 minutes (600 seconds) - menu doesn't change frequently
    return NextResponse.json(representatives, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

