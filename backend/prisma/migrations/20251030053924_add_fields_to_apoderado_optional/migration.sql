/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `Apoderado` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `apoderado` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `rut` VARCHAR(191) NULL,
    ADD COLUMN `telefono` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Apoderado_rut_key` ON `Apoderado`(`rut`);
