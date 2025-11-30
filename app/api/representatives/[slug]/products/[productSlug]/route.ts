import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; productSlug: string } }
) {
  try {
    const representative = await prisma.representative.findUnique({
      where: { slug: params.slug },
    })

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.findUnique({
      where: {
        representativeId_slug: {
          representativeId: representative.id,
          slug: params.productSlug,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; productSlug: string } }
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

    const product = await prisma.product.update({
      where: {
        representativeId_slug: {
          representativeId: representative.id,
          slug: params.productSlug,
        },
      },
      data: {
        name: body.name,
        description: body.description,
        body: body.body,
        imageUrl: body.imageUrl,
        order: body.order,
        isActive: body.isActive,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; productSlug: string } }
) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const representative = await prisma.representative.findUnique({
      where: { slug: params.slug },
    })

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: {
        representativeId_slug: {
          representativeId: representative.id,
          slug: params.productSlug,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

