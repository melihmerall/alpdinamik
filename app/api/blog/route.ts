import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 10

    const where: any = {}
    if (published === 'true') {
      where.isPublished = true
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit || pageSize,
        skip: limit ? 0 : (page - 1) * pageSize,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: posts,
      meta: limit
        ? undefined
        : {
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize),
            },
          },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BLOG_FETCH_ERROR',
          message: 'Failed to fetch blog posts',
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
    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug,
        title: body.title,
        summary: body.summary,
        body: body.body,
        imageUrl: body.imageUrl,
        breadcrumbImageUrl: body.breadcrumbImageUrl,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        ogImage: body.ogImage,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        isPublished: body.isPublished || false,
      },
    })
    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BLOG_CREATE_ERROR',
          message: 'Failed to create blog post',
        },
      },
      { status: 500 }
    )
  }
}

