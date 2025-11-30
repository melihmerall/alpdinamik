import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: testimonials,
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TESTIMONIALS_FETCH_ERROR',
          message: 'Failed to fetch testimonials',
        },
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        role: body.role,
        company: body.company,
        imageUrl: body.imageUrl,
        message: body.message,
        rating: body.rating,
        order: body.order || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    })
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TESTIMONIAL_CREATE_ERROR',
          message: 'Failed to create testimonial',
        },
      },
      { status: 500 }
    )
  }
}

