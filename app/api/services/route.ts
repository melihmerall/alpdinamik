import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICES_FETCH_ERROR',
          message: 'Failed to fetch services',
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
    const service = await prisma.service.create({
          data: {
            slug: body.slug,
            title: body.title,
            summary: body.summary,
            body: body.body,
            icon: body.icon,
            imageUrl: body.imageUrl,
            breadcrumbImageUrl: body.breadcrumbImageUrl,
            metaTitle: body.metaTitle,
            metaDescription: body.metaDescription,
            metaKeywords: body.metaKeywords,
            ogImage: body.ogImage,
            order: body.order || 0,
          },
    })
    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICE_CREATE_ERROR',
          message: 'Failed to create service',
        },
      },
      { status: 500 }
    )
  }
}

