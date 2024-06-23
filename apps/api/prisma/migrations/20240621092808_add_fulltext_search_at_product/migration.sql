-- CreateIndex
CREATE FULLTEXT INDEX `Book_book_name_book_author_idx` ON `Book`(`book_name`, `book_author`);

-- CreateIndex
CREATE FULLTEXT INDEX `BookCategory_book_category_name_idx` ON `BookCategory`(`book_category_name`);
