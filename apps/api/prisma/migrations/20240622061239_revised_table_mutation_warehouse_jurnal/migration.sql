/*
  Warnings:

  - The values [Penambahan,Pengurangan] on the enum `JurnalStock_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `warehouse_latitude` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_longitude` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the `mutationhistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lat` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mutationhistory` DROP FOREIGN KEY `MutationHistory_from_id_fkey`;

-- DropForeignKey
ALTER TABLE `mutationhistory` DROP FOREIGN KEY `MutationHistory_to_id_fkey`;

-- AlterTable
ALTER TABLE `address` ADD COLUMN `lat` VARCHAR(191) NOT NULL,
    ADD COLUMN `long` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `jurnalstock` MODIFY `type` ENUM('PLUS', 'MINUS') NOT NULL;

-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `warehouse_latitude`,
    DROP COLUMN `warehouse_longitude`,
    ADD COLUMN `lat` VARCHAR(191) NOT NULL,
    ADD COLUMN `long` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `mutationhistory`;

-- CreateTable
CREATE TABLE `Mutation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_warehouse_id` INTEGER NOT NULL,
    `to_warehouse_id` INTEGER NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `receiver_name` VARCHAR(191) NOT NULL,
    `book_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('PROCESSED', 'COMPLETED', 'REJECTED', 'CANCELED') NOT NULL,
    `sender_notes` VARCHAR(191) NULL,
    `receiver_notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mutation` ADD CONSTRAINT `Mutation_from_warehouse_id_fkey` FOREIGN KEY (`from_warehouse_id`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mutation` ADD CONSTRAINT `Mutation_to_warehouse_id_fkey` FOREIGN KEY (`to_warehouse_id`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
