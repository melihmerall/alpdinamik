import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';

// GET - List all representatives
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lightweight = searchParams.get('lightweight') === 'true'; // For homepage - only logo data
    const all = searchParams.get('all') === 'true'; // For admin panel - show all (active and inactive)

    if (lightweight) {
      // Lightweight version - only fetch what's needed for homepage logos
      const representatives = await prisma.representative.findMany({
        where: {
          isActive: true,
          logoUrl: { not: null },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          websiteUrl: true,
          order: true,
          isActive: true,
        },
        orderBy: { order: 'asc' },
      });

      // Cache for 10 minutes (600 seconds) - logos don't change frequently
      return NextResponse.json(representatives, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      });
    }

    // Full version with all relations
    // If 'all=true' parameter is provided (for admin panel), show all representatives
    // Otherwise, show only active representatives (for public pages)
    const whereClause = all ? {} : { isActive: true };
    
    const representatives = await prisma.representative.findMany({
      where: whereClause,
      include: {
        categories: {
          include: {
            series: {
              include: {
                products: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
        products: {
          where: { isActive: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Cache for 5 minutes (300 seconds) - representatives don't change frequently
    return NextResponse.json(representatives, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching representatives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representatives' },
      { status: 500 }
    );
  }
}

// POST - Create a new representative
export async function POST(request: NextRequest) {
  const user = await verifyAuth();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.representative.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A representative with this slug already exists' },
        { status: 400 }
      );
    }

    const representative = await prisma.representative.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        logoUrl: body.logoUrl || null,
        websiteUrl: body.websiteUrl || null,
        breadcrumbImageUrl: body.breadcrumbImageUrl || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        order: body.order ? parseInt(body.order.toString()) : 0,
      },
    });

    return NextResponse.json(representative, { status: 201 });
  } catch (error: any) {
    console.error('Error creating representative:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A representative with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create representative', details: error.message },
      { status: 500 }
    );
  }
}

