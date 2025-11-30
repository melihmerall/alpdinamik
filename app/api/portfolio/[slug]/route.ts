import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.referenceProject.findUnique({
      where: { slug: params.slug },
      include: {
        sector: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Project not found' },
        },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PORTFOLIO_FETCH_ERROR',
          message: 'Failed to fetch project',
        },
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const project = await prisma.referenceProject.update({
      where: { slug: params.slug },
      data: {
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
    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PORTFOLIO_UPDATE_ERROR',
          message: 'Failed to update project',
        },
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  try {
    await prisma.referenceProject.delete({
      where: { slug: params.slug },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PORTFOLIO_DELETE_ERROR',
          message: 'Failed to delete project',
        },
      },
      { status: 500 }
    )
  }
}

