import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const contentBlocks = await prisma.contentBlock.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json(contentBlocks);
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch content blocks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, title, body: contentBody } = body;

    const contentBlock = await prisma.contentBlock.create({
      data: {
        key,
        title: title || null,
        body: contentBody || null,
      },
    });

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error("Error creating content block:", error);
    return NextResponse.json(
      { error: "Failed to create content block" },
      { status: 500 }
    );
  }
}

