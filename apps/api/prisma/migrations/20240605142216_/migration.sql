/*
  Warnings:

  - A unique constraint covering the columns `[book_name]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[book_category_name]` on the table `BookCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Book_book_name_key` ON `Book`(`book_name`);

-- CreateIndex
CREATE UNIQUE INDEX `BookCategory_book_category_name_key` ON `BookCategory`(`book_category_name`);
