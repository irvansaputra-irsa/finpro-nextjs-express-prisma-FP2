/*
  Warnings:

  - You are about to drop the column `type` on the `mutationhistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `mutationhistory` DROP COLUMN `type`,
    MODIFY `message` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `JurnalStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NULL,
    `oldStock` INTEGER NOT NULL,
    `newStock` INTEGER NOT NULL,
    `stockChange` INTEGER NOT NULL,
    `type` ENUM('Pemasukan', 'Pengeluaran') NOT NULL,
    `warehouseStockId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JurnalStock` ADD CONSTRAINT `JurnalStock_warehouseStockId_fkey` FOREIGN KEY (`warehouseStockId`) REFERENCES `WarehouseStock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
