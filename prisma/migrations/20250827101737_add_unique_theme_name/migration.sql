/*
  Warnings:

  - A unique constraint covering the columns `[themeName]` on the table `Theme` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Theme_themeName_key` ON `Theme`(`themeName`);
