import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { slug: params.slug },
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Team member not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEAM_FETCH_ERROR',
          message: 'Failed to fetch team member',
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
    const requestBody = await request.json()
    const { name, role, bio, imageUrl, email, phone, socialLinks, category, order, isActive } = requestBody

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (role !== undefined) updateData.role = role
    if (bio !== undefined) updateData.bio = bio || null
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null
    if (email !== undefined) updateData.email = email || null
    if (phone !== undefined) updateData.phone = phone || null
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks || {}
    if (category !== undefined) updateData.category = category || null
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const member = await prisma.teamMember.update({
      where: { slug: params.slug },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEAM_UPDATE_ERROR',
          message: 'Failed to update team member',
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
    await prisma.teamMember.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEAM_DELETE_ERROR',
          message: 'Failed to delete team member',
        },
      },
      { status: 500 }
    )
  }
}

