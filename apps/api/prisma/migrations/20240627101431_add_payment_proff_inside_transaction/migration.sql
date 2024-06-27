/*
  Warnings:

  - Added the required column `payment_proof` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `payment_proof` VARCHAR(191) NOT NULL;
