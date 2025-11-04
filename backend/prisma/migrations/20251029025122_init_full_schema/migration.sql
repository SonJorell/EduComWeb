-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rol_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rolId` INTEGER NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Apoderado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Apoderado_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `nivel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfesorCurso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profesorId` INTEGER NOT NULL,
    `cursoId` INTEGER NOT NULL,

    UNIQUE INDEX `ProfesorCurso_profesorId_cursoId_key`(`profesorId`, `cursoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alumno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `cursoId` INTEGER NOT NULL,
    `apoderadoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NULL,
    `mensaje` VARCHAR(191) NOT NULL,
    `tipo` ENUM('REUNION', 'FELICITACION', 'ANOTACION', 'AVISO') NULL,
    `emisorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recepcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notificacionId` INTEGER NOT NULL,
    `apoderadoId` INTEGER NOT NULL,
    `leido` BOOLEAN NOT NULL DEFAULT false,
    `confirmado` BOOLEAN NOT NULL DEFAULT false,
    `leidoAt` DATETIME(3) NULL,
    `confirmadoAt` DATETIME(3) NULL,

    UNIQUE INDEX `Recepcion_notificacionId_apoderadoId_key`(`notificacionId`, `apoderadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Apoderado` ADD CONSTRAINT `Apoderado_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfesorCurso` ADD CONSTRAINT `ProfesorCurso_profesorId_fkey` FOREIGN KEY (`profesorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfesorCurso` ADD CONSTRAINT `ProfesorCurso_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_apoderadoId_fkey` FOREIGN KEY (`apoderadoId`) REFERENCES `Apoderado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_emisorId_fkey` FOREIGN KEY (`emisorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recepcion` ADD CONSTRAINT `Recepcion_notificacionId_fkey` FOREIGN KEY (`notificacionId`) REFERENCES `Notificacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recepcion` ADD CONSTRAINT `Recepcion_apoderadoId_fkey` FOREIGN KEY (`apoderadoId`) REFERENCES `Apoderado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
