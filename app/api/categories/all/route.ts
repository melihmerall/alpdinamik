import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Get all categories from all representatives (for homepage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '15')
    const representativeSlug = searchParams.get('representative')

    let whereClause: any = {
      isActive: true,
    }

    // If specific representative requested
    if (representativeSlug) {
      const representative = await prisma.representative.findUnique({
        where: { slug: representativeSlug },
      })
      if (representative) {
        whereClause.representativeId = representative.id
      }
    }

    const categories = await prisma.productCategory.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        breadcrumbImageUrl: true,
        order: true,
        representative: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            series: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
      take: limit,
    })

    // Filter out categories with no active series
    const categoriesWithSeries = categories.filter(
      (cat: any) => cat._count.series > 0
    )

    // Cache for 5 minutes (300 seconds) - categories don't change frequently
    return NextResponse.json(categoriesWithSeries, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching all categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

