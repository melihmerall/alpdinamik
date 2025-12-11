import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from '@/lib/middleware';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const representative = await prisma.representative.findUnique({
      where: { slug: params.slug },
      include: {
        products: true,
      },
    });

    if (!representative) {
      return NextResponse.json(
        { error: "Representative not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(representative);
  } catch (error) {
    console.error("Error fetching representative:", error);
    return NextResponse.json(
      { error: "Failed to fetch representative" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, slug, description, logoUrl, websiteUrl, breadcrumbImageUrl, isActive, order } = body;

    // Check if slug is being changed and if new slug already exists
    if (slug !== params.slug) {
      const existing = await prisma.representative.findUnique({
        where: { slug },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A representative with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const representative = await prisma.representative.update({
      where: { slug: params.slug },
      data: {
        name,
        slug,
        description: description || null,
        logoUrl: logoUrl || null,
        websiteUrl: websiteUrl || null,
        breadcrumbImageUrl: breadcrumbImageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order ? parseInt(order.toString()) : 0,
      },
    });

    return NextResponse.json(representative);
  } catch (error: any) {
    console.error("Error updating representative:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A representative with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update representative", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Prisma cascade delete will automatically delete:
    // - ProductCategory (onDelete: Cascade)
    // - ProductSeries (onDelete: Cascade via category)
    // - Product (onDelete: Cascade)
    // - ProductImage (onDelete: Cascade via product)
    await prisma.representative.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ message: "Representative deleted successfully" });
  } catch (error) {
    console.error("Error deleting representative:", error);
    return NextResponse.json(
      { error: "Failed to delete representative" },
      { status: 500 }
    );
  }
}
