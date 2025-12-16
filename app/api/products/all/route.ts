import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Get all products from all representatives (for homepage)
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

    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        maxCapacity: true,
        order: true,
        representative: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        series: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
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

    // Cache for 5 minutes (300 seconds) - products don't change frequently
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching all products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

