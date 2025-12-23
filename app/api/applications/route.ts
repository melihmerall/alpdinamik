import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/middleware";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get("all") === "true";
    const items = await prisma.applicationShowcase.findMany({
      where: showAll
        ? {}
        : {
            isActive: true,
          },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.applicationShowcase.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const item = await prisma.applicationShowcase.create({
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

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Error creating application showcase:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status: 500 }
    );
  }
}
