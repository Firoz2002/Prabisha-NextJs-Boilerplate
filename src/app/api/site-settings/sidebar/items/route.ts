import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ItemCreateSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().optional().nullable(),
  position: z.number().int().nonnegative().default(0),
  isActive: z.boolean().optional(),
  sidebarGroupId: z.string().min(1),
  // Optional: role access array if you implemented it
  roleAccess: z.array(z.object({
    role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
    hasAccess: z.boolean().default(true),
  })).optional(),
});

const ItemUpdateSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).optional(),
  href: z.string().min(1).optional(),
  icon: z.string().optional().nullable(),
  position: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  sidebarGroupId: z.string().min(1).optional(),
  roleAccess: z.array(z.object({
    role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
    hasAccess: z.boolean().default(true),
  })).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sidebarGroupId = searchParams.get("sidebarGroupId") || undefined;

    const items = await prisma.sidebarItem.findMany({
      where: { sidebarGroupId },
      include: { sidebarGroup: true, roleAccess: true as any },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ data: items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = ItemCreateSchema.parse(await req.json());

    const created = await prisma.sidebarItem.create({
      data: {
        label: payload.label,
        href: payload.href,
        icon: payload.icon ?? null,
        position: payload.position ?? 0,
        isActive: payload.isActive ?? true,
        sidebarGroupId: payload.sidebarGroupId,
        ...(payload.roleAccess && (prisma as any).sidebarItemAccess
          ? {
              roleAccess: {
                createMany: {
                  data: payload.roleAccess.map((r) => ({ role: r.role, hasAccess: r.hasAccess })),
                  skipDuplicates: true,
                },
              },
            }
          : {}),
      },
      include: { roleAccess: true as any },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    const msg = e?.issues?.[0]?.message ?? "Failed to create item";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, roleAccess, ...rest } = ItemUpdateSchema.parse(await req.json());

    const updated = await prisma.sidebarItem.update({
      where: { id },
      data: rest,
      include: { roleAccess: true as any },
    });

    // If roleAccess array provided and you implemented the table, replace it
    if (roleAccess && (prisma as any).sidebarItemAccess) {
      await prisma.$transaction([
        (prisma as any).sidebarItemAccess.deleteMany({ where: { sidebarItemId: id } }),
        (prisma as any).sidebarItemAccess.createMany({
          data: roleAccess.map((r) => ({ sidebarItemId: id, role: r.role, hasAccess: r.hasAccess })),
        }),
      ]);
    }

    const fresh = await prisma.sidebarItem.findUnique({
      where: { id },
      include: { roleAccess: true as any },
    });

    return NextResponse.json({ data: fresh });
  } catch (e: any) {
    console.error(e);
    const msg = e?.issues?.[0]?.message ?? "Failed to update item";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = z.object({ id: z.string().min(1) }).parse(await req.json());

    const deleted = await prisma.sidebarItem.delete({ where: { id } });
    return NextResponse.json({ data: deleted });
  } catch (e: any) {
    console.error(e);
    const msg = e?.issues?.[0]?.message ?? "Failed to delete item";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
