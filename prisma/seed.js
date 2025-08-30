// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const superAdminPassword = await bcrypt.hash("super-admin123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // Create users
  await prisma.user.upsert({
    where: { email: "super-admin.prabisha@gmail.com" },
    update: {},
    create: {
      email: "super-admin.prabisha@gmail.com",
      name: "Super Admin",
      password: superAdminPassword,
      role: "SUPERADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin.prabisha@gmail.com" },
    update: {},
    create: {
      email: "admin.prabisha@gmail.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user.prabisha@gmail.com" },
    update: {},
    create: {
      email: "user.prabisha@gmail.com",
      name: "Normal User",
      password: userPassword,
      role: "USER",
    },
  });

  // Create default theme
  await prisma.theme.upsert({
    where: { themeName: "default" },
    update: {
      primaryColor: "#2832B1",
      secondaryColor: "#E17942",
      font: "Montserrat",
    },
    create: {
      themeName: "default",
      primaryColor: "#2832B1",
      secondaryColor: "#E17942",
      font: "Montserrat",
      tertiaryColor: "#000000", // optional placeholder
      backgroundColor: "#ffffff",
      textColor: "#000000",
      mode: "LIGHT",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
