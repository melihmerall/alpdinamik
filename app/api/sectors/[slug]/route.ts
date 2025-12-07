import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const sector = await prisma.sector.findUnique({
      where: { slug: params.slug },
      include: {
        _count: {
          select: { references: true }
        }
      }
    })

    if (!sector) {
      return NextResponse.json(
        { error: 'Sector not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sector)
  } catch (error) {
    console.error('Error fetching sector:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sector' },
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
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const requestBody = await request.json()
    const { name, description, body: bodyContent, icon, imageUrl, order } = requestBody

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (bodyContent !== undefined) updateData.body = bodyContent || null
    if (icon !== undefined) updateData.icon = icon || null
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null
    if (order !== undefined) updateData.order = order

    const sector = await prisma.sector.update({
      where: { slug: params.slug },
      data: updateData,
    })

    return NextResponse.json(sector)
  } catch (error) {
    console.error('Error updating sector:', error)
    return NextResponse.json(
      { error: 'Failed to update sector' },
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
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    await prisma.sector.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: 'Sector deleted successfully' })
  } catch (error) {
    console.error('Error deleting sector:', error)
    return NextResponse.json(
      { error: 'Failed to delete sector' },
      { status: 500 }
    )
  }
}

