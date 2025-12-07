import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const sectors = await prisma.sector.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { references: true }
        }
      }
    })
    return NextResponse.json(sectors)
  } catch (error) {
    console.error('Error fetching sectors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sectors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { slug, name, description, body: bodyContent, icon, imageUrl, breadcrumbImageUrl, order } = body

    if (!slug || !name || !description) {
      return NextResponse.json(
        { error: 'Slug, name, and description are required' },
        { status: 400 }
      )
    }

    const sector = await prisma.sector.create({
      data: {
        slug,
        name,
        description,
        body: bodyContent || null,
        icon: icon || null,
        imageUrl: imageUrl || null,
        breadcrumbImageUrl: breadcrumbImageUrl || null,
        order: order || 0,
      },
    })

    return NextResponse.json(sector, { status: 201 })
  } catch (error) {
    console.error('Error creating sector:', error)
    return NextResponse.json(
      { error: 'Failed to create sector' },
      { status: 500 }
    )
  }
}

