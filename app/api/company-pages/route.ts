import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const page = await prisma.companyPage.findUnique({
        where: { slug },
      })

      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(page)
    }

    const pages = await prisma.companyPage.findMany({
      orderBy: { slug: 'asc' },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching company pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company pages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slug,
      title,
      subtitle,
      body,
      imageUrl,
      stat1Number,
      stat1Label,
      stat2Number,
      stat2Label,
      stat3Number,
      stat3Label,
      ctaLabel,
      ctaUrl,
    } = body

    if (!slug || !title || !body) {
      return NextResponse.json(
        { error: 'Slug, title, and body are required' },
        { status: 400 }
      )
    }

    const page = await prisma.companyPage.create({
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        body,
        imageUrl: imageUrl || null,
        stat1Number: stat1Number || null,
        stat1Label: stat1Label || null,
        stat2Number: stat2Number || null,
        stat2Label: stat2Label || null,
        stat3Number: stat3Number || null,
        stat3Label: stat3Label || null,
        ctaLabel: ctaLabel || null,
        ctaUrl: ctaUrl || null,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating company page:', error)
    return NextResponse.json(
      { error: 'Failed to create company page' },
      { status: 500 }
    )
  }
}

