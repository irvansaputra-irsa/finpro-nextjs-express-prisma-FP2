/*
  Warnings:

  - You are about to drop the column `createdAt` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `bookcategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookcategory` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `bookimage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookimage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `mutationhistory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `mutationhistory` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the `mapwarehousebook` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `BookCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `BookImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MutationHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `samples` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mapwarehousebook` DROP FOREIGN KEY `MapWarehouseBook_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `mapwarehousebook` DROP FOREIGN KEY `MapWarehouseBook_warehouse_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_destination_id_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `bookcategory` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `bookimage` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `mutationhistory` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `samples` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `mapwarehousebook`;

-- CreateTable
CREATE TABLE `WarehouseStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_id` INTEGER NOT NULL,
    `warehouse_id` INTEGER NOT NULL,
    `stockQty` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WarehouseStock` ADD CONSTRAINT `WarehouseStock_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseStock` ADD CONSTRAINT `WarehouseStock_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
