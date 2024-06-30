-- AddForeignKey
ALTER TABLE `Mutation` ADD CONSTRAINT `Mutation_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
