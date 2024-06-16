/*
  Warnings:

  - You are about to drop the column `warehouse_country` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_postal_code` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_street` on the `warehouse` table. All the data in the column will be lost.
  - Added the required column `warehouse_detail_loc` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse_province` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `warehouse_country`,
    DROP COLUMN `warehouse_postal_code`,
    DROP COLUMN `warehouse_street`,
    ADD COLUMN `warehouse_detail_loc` VARCHAR(191) NOT NULL,
    ADD COLUMN `warehouse_province` VARCHAR(191) NOT NULL;
