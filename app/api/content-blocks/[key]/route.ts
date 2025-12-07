import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const contentBlock = await prisma.contentBlock.findUnique({
      where: { key: params.key },
    });

    if (!contentBlock) {
      return NextResponse.json(
        { error: "Content block not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error("Error fetching content block:", error);
    return NextResponse.json(
      { error: "Failed to fetch content block" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const body = await request.json();
    const { title, body: contentBody } = body;

    const contentBlock = await prisma.contentBlock.update({
      where: { key: params.key },
      data: {
        title: title || null,
        body: contentBody || null,
      },
    });

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error("Error updating content block:", error);
    return NextResponse.json(
      { error: "Failed to update content block" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await prisma.contentBlock.delete({
      where: { key: params.key },
    });

    return NextResponse.json({ message: "Content block deleted successfully" });
  } catch (error) {
    console.error("Error deleting content block:", error);
    return NextResponse.json(
      { error: "Failed to delete content block" },
      { status: 500 }
    );
  }
}

