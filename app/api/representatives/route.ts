import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/middleware';

const prisma = new PrismaClient();

// GET - List all representatives
export async function GET(request: NextRequest) {
  try {
    const representatives = await prisma.representative.findMany({
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

    return NextResponse.json(representatives);
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

