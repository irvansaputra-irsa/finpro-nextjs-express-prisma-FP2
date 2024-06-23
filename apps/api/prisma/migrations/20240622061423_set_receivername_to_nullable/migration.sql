/*
  Warnings:

  - Made the column `sender_name` on table `mutation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mutation` MODIFY `sender_name` VARCHAR(191) NOT NULL,
    MODIFY `receiver_name` VARCHAR(191) NULL;
