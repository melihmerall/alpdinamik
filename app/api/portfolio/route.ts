import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sectorId = searchParams.get('sectorId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const where: any = {}
    if (sectorId) {
      where.sectorId = sectorId
    }

    const projects = await prisma.referenceProject.findMany({
      where,
      include: {
        sector: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Return array directly for public API
    if (limit) {
      return NextResponse.json(projects)
    }
    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PORTFOLIO_FETCH_ERROR',
          message: 'Failed to fetch portfolio',
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
    const project = await prisma.referenceProject.create({
      data: {
        slug: body.slug,
        title: body.title,
        summary: body.summary,
        body: body.body,
        sectorId: body.sectorId || null,
        year: body.year,
        customerName: body.customerName,
        location: body.location,
        imageUrl: body.imageUrl,
        breadcrumbImageUrl: body.breadcrumbImageUrl,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        ogImage: body.ogImage,
      },
    })
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PORTFOLIO_CREATE_ERROR',
          message: 'Failed to create project',
        },
      },
      { status: 500 }
    )
  }
}

