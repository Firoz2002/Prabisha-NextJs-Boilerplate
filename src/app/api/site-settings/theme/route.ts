// app/api/v1/theme/route.ts
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { ThemeMode } from "@prisma/client";
import { getServerSession } from "next-auth";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
// GET /api/v1/theme - Get current theme
export async function GET() {
  try {
    // Fetch the first (and only) theme
    const theme = await prisma.theme.findFirst();

    if (!theme) {
      return NextResponse.json({
        data: {
          themeName: "Default Theme",
          primaryColor: "#3b82f6",
          secondaryColor: "#10b981",
          tertiaryColor: "#8b5cf6",
          font: "inter",
          backgroundColor: "#ffffff",
          textColor: "#000000",
          mode: "LIGHT",
          logoUrl: null,
          faviconUrl: null,
        },
      });
    }

    return NextResponse.json({ data: theme });
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json({
      error: "Internal server error",
    }, { status: 500 });
  }
}

// PUT /api/v1/theme - Update theme
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Extract form data
    const themeName = formData.get("themeName") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const secondaryColor = formData.get("secondaryColor") as string;
    const tertiaryColor = formData.get("tertiaryColor") as string;
    const font = formData.get("font") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const textColor = formData.get("textColor") as string;
    const mode = formData.get("mode") as string;

    const logoFile = formData.get("logo") as File | null;
    const faviconFile = formData.get("favicon") as File | null;

    let logoUrl: string | undefined;
    let faviconUrl: string | undefined;

    if (logoFile && logoFile.size > 0) {
      // Convert file to buffer
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });
      logoUrl = (uploadResult as UploadApiResponse).secure_url;
    }

    if (faviconFile && faviconFile.size > 0) {
      // Convert file to buffer
      const bytes = await faviconFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });
      faviconUrl = (uploadResult as UploadApiResponse).secure_url;
    }

    // Check if theme exists
    const existingTheme = await prisma.theme.findFirst();

    let theme;
    if (existingTheme) {
      theme = await prisma.theme.update({
        where: { id: existingTheme.id },
        data: {
          themeName,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          font,
          backgroundColor,
          textColor,
          mode: mode as ThemeMode,
          ...(logoUrl && { logoUrl }),
          ...(faviconUrl && { faviconUrl }),
        },
      });
    } else {
      theme = await prisma.theme.create({
        data: {
          themeName,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          font,
          backgroundColor,
          textColor,
          mode: mode as ThemeMode,
          logoUrl,
          faviconUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
