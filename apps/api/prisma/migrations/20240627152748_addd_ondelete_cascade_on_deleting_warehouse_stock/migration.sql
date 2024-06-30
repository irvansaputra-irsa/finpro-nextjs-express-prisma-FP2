-- DropForeignKey
ALTER TABLE `jurnalstock` DROP FOREIGN KEY `JurnalStock_warehouseStockId_fkey`;

-- AddForeignKey
ALTER TABLE `JurnalStock` ADD CONSTRAINT `JurnalStock_warehouseStockId_fkey` FOREIGN KEY (`warehouseStockId`) REFERENCES `WarehouseStock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
