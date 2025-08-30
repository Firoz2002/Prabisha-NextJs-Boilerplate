import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get("role") || undefined;

    const roleSchema = z.enum(["SUPERADMIN", "ADMIN", "USER"]).optional();
    const role = roleSchema.parse(roleParam);

    const groups = await prisma.sidebarGroup.findMany({
      where: role && (prisma as any).sidebarGroupAccess
        ? {
            roleAccess: {
              some: { role, hasAccess: true },
            },
          }
        : undefined,
      include: {
        items: {
          where: role && (prisma as any).sidebarItemAccess
            ? {
                roleAccess: {
                  some: { role, hasAccess: true },
                },
              }
            : undefined,
          orderBy: { position: "asc" },
        },
      },
      orderBy: { position: "asc" },
    });

    // Optionally hide empty groups when filtering
    const filtered =
      role && ((prisma as any).sidebarGroupAccess || (prisma as any).sidebarItemAccess)
        ? groups.filter((g) => g.items.length > 0)
        : groups;

    return NextResponse.json({ data: filtered });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch sidebar" }, { status: 500 });
  }
}
