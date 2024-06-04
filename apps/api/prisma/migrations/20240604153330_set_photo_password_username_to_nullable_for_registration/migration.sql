-- DropIndex
DROP INDEX `Transaction_destination_id_fkey` ON `transaction`;

-- AlterTable
ALTER TABLE `user` MODIFY `user_name` VARCHAR(191) NULL,
    MODIFY `user_password` VARCHAR(191) NULL;
