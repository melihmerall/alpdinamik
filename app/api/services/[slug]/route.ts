import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'
import { getService } from '@/lib/content'
import { revalidateTag } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await getService(params.slug)

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Service not found' },
        },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICE_FETCH_ERROR',
          message: 'Failed to fetch service',
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
    const service = await prisma.service.update({
      where: { slug: params.slug },
      data: {
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
        order: body.order,
      },
    })
    revalidateTag('services')
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICE_UPDATE_ERROR',
          message: 'Failed to update service',
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
    await prisma.service.delete({
      where: { slug: params.slug },
    })
    revalidateTag('services')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICE_DELETE_ERROR',
          message: 'Failed to delete service',
        },
      },
      { status: 500 }
    )
  }
}
