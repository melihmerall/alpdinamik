import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/middleware';

const prisma = new PrismaClient();

// GET - Get all images for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; productSlug: string } }
) {
  try {
    const { slug, productSlug } = params;

    const representative = await prisma.representative.findUnique({
      where: { slug },
    });

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        representativeId_slug: {
          representativeId: representative.id,
          slug: productSlug,
        },
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product.images);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    );
  }
}

// POST - Add a new image to a product
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; productSlug: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { slug, productSlug } = params;
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

    const product = await prisma.product.findUnique({
      where: {
        representativeId_slug: {
          representativeId: representative.id,
          slug: productSlug,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const image = await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: body.imageUrl,
        alt: body.alt || product.name,
        order: body.order || 0,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating product image:', error);
    return NextResponse.json(
      { error: 'Failed to create product image' },
      { status: 500 }
    );
  }
}

