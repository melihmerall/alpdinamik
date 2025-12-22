import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; categorySlug: string } }
) {
  try {
    const { slug, categorySlug } = params;

    const representative = await prisma.representative.findUnique({
      where: { slug },
    });

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    const category = await prisma.productCategory.findFirst({
      where: {
        representativeId: representative.id,
        slug: categorySlug,
      },
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
                maxCapacity: true,
              },
            },
          },
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; categorySlug: string } }
) {
  try {
    const { slug, categorySlug } = params;
    const body = await request.json();

    const representative = await prisma.representative.findUnique({
      where: { slug },
    });

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    const category = await prisma.productCategory.findFirst({
      where: {
        representativeId: representative.id,
        slug: categorySlug,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.productCategory.update({
      where: { id: category.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        breadcrumbImageUrl: body.breadcrumbImageUrl,
        order: body.order,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; categorySlug: string } }
) {
  try {
    const { slug, categorySlug } = params;

    const representative = await prisma.representative.findUnique({
      where: { slug },
    });

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    const category = await prisma.productCategory.findFirst({
      where: {
        representativeId: representative.id,
        slug: categorySlug,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    await prisma.productCategory.delete({
      where: { id: category.id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

