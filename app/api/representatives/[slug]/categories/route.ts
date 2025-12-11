import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all categories for a representative
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get representative
    const representative = await prisma.representative.findUnique({
      where: { slug },
    });

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    // Get categories
    const categories = await prisma.productCategory.findMany({
      where: { representativeId: representative.id },
      include: {
        series: {
          include: {
            variants: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              include: {
                products: {
                  where: { isActive: true },
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    slug: true,
                    name: true,
                    maxCapacity: true,
                  },
                },
              },
            },
            products: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              select: {
                id: true,
                slug: true,
                name: true,
              },
            },
          },
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category for a representative
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

    // Get representative
    const representative = await prisma.representative.findUnique({
      where: { slug },
    });

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    // Generate slug from name if not provided
    const categorySlug = body.slug || body.name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const category = await prisma.productCategory.create({
      data: {
        representativeId: representative.id,
        slug: categorySlug,
        name: body.name,
        description: body.description,
        breadcrumbImageUrl: body.breadcrumbImageUrl,
        order: body.order || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

