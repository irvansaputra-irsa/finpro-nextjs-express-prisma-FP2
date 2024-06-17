/*
  Warnings:

  - You are about to drop the column `warehouse_langitude` on the `warehouse` table. All the data in the column will be lost.
  - Added the required column `warehouse_latitude` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `warehouse_langitude`,
    ADD COLUMN `warehouse_latitude` VARCHAR(191) NOT NULL;
