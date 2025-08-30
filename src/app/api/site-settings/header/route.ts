import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// ✅ GET all header items
export async function GET(request: NextRequest) {
  try {
    const headers = await prisma.headerItem.findMany({
      include: { subHeaderItems: true }, // include sub headers too
      orderBy: { position: "asc" },
    });
    return NextResponse.json({ headers });
  } catch (error) {
    console.error("Error fetching header items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ CREATE a new header item
export async function POST(request: NextRequest) {
  try {
    const { label, href, icon, position, isActive } = await request.json();

    const newHeader = await prisma.headerItem.create({
      data: {
        label,
        href,
        icon,
        position,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ data: newHeader }, { status: 201 });
  } catch (error) {
    console.error("Error creating header item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ UPDATE a header item
export async function PUT(request: NextRequest) {
  try {
    const { id, label, href, icon, position, isActive } = await request.json();

    const updatedHeader = await prisma.headerItem.update({
      where: { id },
      data: {
        label,
        href,
        icon,
        position,
        isActive,
      },
    });

    return NextResponse.json({ data: updatedHeader });
  } catch (error) {
    console.error("Error updating header item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ DELETE a header item
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const deletedHeader = await prisma.headerItem.delete({
      where: { id },
    });

    return NextResponse.json({ data: deletedHeader });
  } catch (error) {
    console.error("Error deleting header item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
