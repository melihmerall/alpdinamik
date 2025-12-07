import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
  try {
    const body = await request.json();
    const { name, slug, description, logoUrl, websiteUrl, isActive, order } = body;

    const representative = await prisma.representative.update({
      where: { slug: params.slug },
      data: {
        name,
        slug,
        description: description || null,
        logoUrl: logoUrl || null,
        websiteUrl: websiteUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(representative);
  } catch (error) {
    console.error("Error updating representative:", error);
    return NextResponse.json(
      { error: "Failed to update representative" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
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
