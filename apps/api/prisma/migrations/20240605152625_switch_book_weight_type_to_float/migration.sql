/*
  Warnings:

  - You are about to alter the column `book_weight` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `book_weight` DOUBLE NOT NULL;
