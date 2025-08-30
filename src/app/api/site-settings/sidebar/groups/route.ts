import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const GroupCreateSchema = z.object({
  title: z.string().min(1),
  position: z.number().int().nonnegative().default(0),
  isActive: z.boolean().optional(),
});

const GroupUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  position: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const groups = await prisma.sidebarGroup.findMany({
      include: { items: true, roleAccess: true as any }, // ignore if you don't have roleAccess
      orderBy: { position: "asc" },
    });
    return NextResponse.json({ data: groups });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, position, isActive } = GroupCreateSchema.parse(body);

    const created = await prisma.sidebarGroup.create({
      data: { title, position, isActive: isActive ?? true },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    const msg = e?.issues?.[0]?.message ?? "Failed to create group";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = GroupUpdateSchema.parse(body);

    const updated = await prisma.sidebarGroup.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: updated });
  } catch (e: any) {
    console.error(e);
    const msg = e?.issues?.[0]?.message ?? "Failed to update group";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = z.object({ id: z.string().min(1) }).parse(await req.json());

    const deleted = await prisma.sidebarGroup.delete({ where: { id } });
    return NextResponse.json({ data: deleted });
  } catch (e: any) {
    console.error(e);
    const msg = e?.issues?.[0]?.message ?? "Failed to delete group";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
