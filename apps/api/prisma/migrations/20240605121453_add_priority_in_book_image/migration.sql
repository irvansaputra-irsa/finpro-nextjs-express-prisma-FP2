/*
  Warnings:

  - Added the required column `order` to the `BookImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookimage` ADD COLUMN `order` INTEGER NOT NULL;
