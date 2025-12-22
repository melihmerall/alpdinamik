import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get a single series
export async function GET(
  request: NextRequest,
  { params }: { params: { seriesId: string } }
) {
  try {
    const { seriesId } = params;

    const series = await prisma.productSeries.findUnique({
      where: { id: seriesId },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        products: {
          where: { isActive: true, variantId: null },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!series) {
      return NextResponse.json(
        { error: 'Series not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}

// PUT - Update a series
export async function PUT(
  request: NextRequest,
  { params }: { params: { seriesId: string } }
) {
  try {
    const { seriesId } = params;
    const body = await request.json();

    const updated = await prisma.productSeries.update({
      where: { id: seriesId },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        imageUrl: body.imageUrl ?? null,
        order: body.order,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json(
      { error: 'Failed to update series' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a series
export async function DELETE(
  request: NextRequest,
  { params }: { params: { seriesId: string } }
) {
  try {
    const { seriesId } = params;

    await prisma.productSeries.delete({
      where: { id: seriesId },
    });

    return NextResponse.json({ message: 'Series deleted successfully' });
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json(
      { error: 'Failed to delete series' },
      { status: 500 }
    );
  }
}
