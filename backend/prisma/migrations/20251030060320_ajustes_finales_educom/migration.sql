/*
  Warnings:

  - You are about to drop the column `password` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Apoderado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `curso` ADD COLUMN `anio` INTEGER NULL,
    ADD COLUMN `jornada` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notificacion` ADD COLUMN `prioridad` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `profesorcurso` ADD COLUMN `rolInterno` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `password`,
    ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL DEFAULT 'TEMP123!';

-- CreateIndex
CREATE UNIQUE INDEX `Apoderado_email_key` ON `Apoderado`(`email`);
