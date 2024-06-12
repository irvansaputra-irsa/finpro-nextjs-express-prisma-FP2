/*
  Warnings:

  - You are about to drop the column `from_warehouse_id` on the `mutationhistory` table. All the data in the column will be lost.
  - You are about to drop the column `to_warehouse_id` on the `mutationhistory` table. All the data in the column will be lost.
  - Added the required column `from_id` to the `MutationHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `MutationHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mutationhistory` DROP COLUMN `from_warehouse_id`,
    DROP COLUMN `to_warehouse_id`,
    ADD COLUMN `from_id` INTEGER NOT NULL,
    ADD COLUMN `to_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MutationHistory` ADD CONSTRAINT `MutationHistory_from_id_fkey` FOREIGN KEY (`from_id`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MutationHistory` ADD CONSTRAINT `MutationHistory_to_id_fkey` FOREIGN KEY (`to_id`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
