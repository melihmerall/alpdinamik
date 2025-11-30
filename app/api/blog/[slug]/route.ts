import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    })

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Blog post not found' },
        },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BLOG_FETCH_ERROR',
          message: 'Failed to fetch blog post',
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
    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
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
        isPublished: body.isPublished,
      },
    })
    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BLOG_UPDATE_ERROR',
          message: 'Failed to update blog post',
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
    await prisma.blogPost.delete({
      where: { slug: params.slug },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BLOG_DELETE_ERROR',
          message: 'Failed to delete blog post',
        },
      },
      { status: 500 }
    )
  }
}

