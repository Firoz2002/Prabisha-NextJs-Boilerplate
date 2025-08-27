// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Roles ---
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: { name: "SUPER_ADMIN" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER" },
  });

  // --- Create Default Super Admin User ---
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@company.com" },
    update: {},
    create: {
      email: "superadmin@company.com",
      name: "Super Admin",
      password: "hashed-password", // ⚠️ replace with hashed password
      role: { connect: { id: superAdminRole.id } },
    },
  });

  // --- Header Items ---
  const headerHome = await prisma.headerItem.create({
    data: {
      label: "Home",
      href: "/",
      position: 1,
      isActive: true,
      subHeaderItems: {
        create: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
    },
  });

  const headerAbout = await prisma.headerItem.create({
    data: {
      label: "About",
      href: "/about",
      position: 2,
      isActive: true,
    },
  });

  // --- Sidebar Items ---
  await prisma.sidebarItem.createMany({
    data: [
      { label: "Dashboard", href: "/dashboard", position: 1, isActive: true },
      { label: "Users", href: "/users", position: 2, isActive: true },
      { label: "Settings", href: "/settings", position: 3, isActive: true },
    ],
  });

  // --- Footer Items ---
  await prisma.footerItem.createMany({
    data: [
      { label: "Privacy Policy", href: "/privacy", position: 1, isActive: true },
      { label: "Terms of Service", href: "/terms", position: 2, isActive: true },
      { label: "Contact Us", href: "/contact", position: 3, isActive: true },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
