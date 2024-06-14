/*
  Warnings:

  - You are about to alter the column `book_price` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `book_price` VARCHAR(191) NOT NULL;
