import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    }

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: members,
    })
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEAM_FETCH_ERROR',
          message: 'Failed to fetch team members',
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
    const member = await prisma.teamMember.create({
      data: {
        slug: body.slug,
        name: body.name,
        role: body.role,
        bio: body.bio,
        imageUrl: body.imageUrl,
        email: body.email,
        phone: body.phone,
        socialLinks: body.socialLinks || {},
        category: body.category,
        order: body.order || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    })
    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEAM_CREATE_ERROR',
          message: 'Failed to create team member',
        },
      },
      { status: 500 }
    )
  }
}

