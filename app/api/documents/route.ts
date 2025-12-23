import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/middleware";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get("all") === "true";
    const items = await prisma.document.findMany({
      where: showAll
        ? {}
        : {
            isActive: true,
          },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
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
    
    const item = await prisma.document.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl || null,
        pdfUrl: body.pdfUrl,
        order: body.order ? parseInt(body.order.toString(), 10) : 0,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create document" },
      { status: 500 }
    );
  }
}
