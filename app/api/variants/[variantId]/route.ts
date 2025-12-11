import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/middleware';

const prisma = new PrismaClient();

// GET - Get a single variant
export async function GET(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  try {
    const { variantId } = params;

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        series: {
          include: {
            category: true,
          },
        },
        products: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error fetching variant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variant' },
      { status: 500 }
    );
  }
}

// PUT - Update a variant
export async function PUT(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { variantId } = params;
    const body = await request.json();

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        imageUrl: body.imageUrl,
        order: body.order,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { variantId } = params;

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return NextResponse.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    );
  }
}
