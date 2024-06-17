/*
  Warnings:

  - The values [Pemasukan,Pengeluaran] on the enum `JurnalStock_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `jurnalstock` MODIFY `type` ENUM('Penambahan', 'Pengurangan') NOT NULL;
