-- DropForeignKey
ALTER TABLE `bookimage` DROP FOREIGN KEY `BookImage_book_id_fkey`;

-- AddForeignKey
ALTER TABLE `BookImage` ADD CONSTRAINT `BookImage_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
