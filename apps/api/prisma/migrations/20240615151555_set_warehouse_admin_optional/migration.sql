-- DropForeignKey
ALTER TABLE `warehouse` DROP FOREIGN KEY `Warehouse_warehouse_admin_id_fkey`;

-- AlterTable
ALTER TABLE `warehouse` MODIFY `warehouse_admin_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_warehouse_admin_id_fkey` FOREIGN KEY (`warehouse_admin_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
