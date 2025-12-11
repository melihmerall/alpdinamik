import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const representative = await prisma.representative.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          include: {
            series: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(representative.products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const representative = await prisma.representative.findUnique({
      where: { slug: params.slug },
    })

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.create({
      data: {
        representativeId: representative.id,
        seriesId: body.seriesId || null,
        variantId: body.variantId || null,
        slug: body.slug,
        name: body.name,
        description: body.description,
        body: body.body,
        imageUrl: body.imageUrl,
        infoImageUrl: body.infoImageUrl,
        breadcrumbImageUrl: body.breadcrumbImageUrl,
        svgBaseImage: body.svgBaseImage,
        svgComponents: body.svgComponents,
        maxCapacity: body.maxCapacity,
        technicalPdfUrl: body.technicalPdfUrl,
        file2dUrl: body.file2dUrl,
        file3dUrl: body.file3dUrl,
        externalProductUrl: body.externalProductUrl,
        order: body.order || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

