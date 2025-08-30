/*
  Warnings:

  - Added the required column `sidebarGroupId` to the `SidebarItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sidebaritem` ADD COLUMN `sidebarGroupId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `SidebarGroup` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SidebarGroupAccess` (
    `role` ENUM('SUPERADMIN', 'ADMIN', 'USER') NOT NULL,
    `sidebarGroupId` VARCHAR(191) NOT NULL,
    `hasAccess` BOOLEAN NOT NULL DEFAULT true,

    INDEX `SidebarGroupAccess_sidebarGroupId_idx`(`sidebarGroupId`),
    PRIMARY KEY (`role`, `sidebarGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SidebarItemAccess` (
    `role` ENUM('SUPERADMIN', 'ADMIN', 'USER') NOT NULL,
    `sidebarItemId` VARCHAR(191) NOT NULL,
    `hasAccess` BOOLEAN NOT NULL DEFAULT true,

    INDEX `SidebarItemAccess_sidebarItemId_idx`(`sidebarItemId`),
    PRIMARY KEY (`role`, `sidebarItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SidebarItem` ADD CONSTRAINT `SidebarItem_sidebarGroupId_fkey` FOREIGN KEY (`sidebarGroupId`) REFERENCES `SidebarGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SidebarGroupAccess` ADD CONSTRAINT `SidebarGroupAccess_sidebarGroupId_fkey` FOREIGN KEY (`sidebarGroupId`) REFERENCES `SidebarGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SidebarItemAccess` ADD CONSTRAINT `SidebarItemAccess_sidebarItemId_fkey` FOREIGN KEY (`sidebarItemId`) REFERENCES `SidebarItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
