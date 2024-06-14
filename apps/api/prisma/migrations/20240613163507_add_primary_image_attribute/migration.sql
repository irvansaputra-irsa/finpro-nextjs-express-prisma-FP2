/*
  Warnings:

  - You are about to drop the column `order` on the `bookimage` table. All the data in the column will be lost.
  - Added the required column `primary_image` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `primary_image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `bookimage` DROP COLUMN `order`;
