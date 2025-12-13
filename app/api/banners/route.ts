import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: 'asc' },
      take: limit ? parseInt(limit) : undefined,
    })

    // Cache for 2 minutes (120 seconds) - banners don't change frequently
    return NextResponse.json(banners, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, imageUrl, videoUrl, ctaLabel, ctaUrl, isActive, order } = body

    if (!imageUrl && !videoUrl) {
      return NextResponse.json(
        { error: 'ImageUrl or VideoUrl is required' },
        { status: 400 }
      )
    }

    const banner = await prisma.banner.create({
      data: {
        title: title || null,
        subtitle: subtitle || null,
        imageUrl: imageUrl || '',
        videoUrl: videoUrl || null,
        ctaLabel: ctaLabel || null,
        ctaUrl: ctaUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      },
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}

