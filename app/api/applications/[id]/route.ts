import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/middleware";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.applicationShowcase.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Generate slug from title if not provided
    let slug = body.slug?.trim() || '';
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    // Check if slug is already taken by another record
    const existing = await prisma.applicationShowcase.findUnique({ where: { slug } });
    let finalSlug = slug;
    if (existing && existing.id !== params.id) {
      let counter = 1;
      while (await prisma.applicationShowcase.findUnique({ where: { slug: `${slug}-${counter}` } })) {
        counter++;
      }
      finalSlug = `${slug}-${counter}`;
    }
    
    const item = await prisma.applicationShowcase.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: finalSlug,
        summary: body.summary || null,
        body: body.body || null,
        imageUrl: body.imageUrl || null,
        breadcrumbImageUrl: body.breadcrumbImageUrl || null,
        order: body.order ? parseInt(body.order.toString(), 10) : 0,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.applicationShowcase.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Application deleted" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
