import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Service } from 'typedi';
import { BookCategory } from '@prisma/client';
import { productCategory } from '@/interfaces/productCategory.interfaces';

@Service()
export class ProductCategoryQuery {
  public createProductCategoryQuery = async (
    param: productCategory,
  ): Promise<BookCategory> => {
    try {
      const transaction = await prisma.$transaction(async () => {
        try {
          const { bookCategoryName } = param;

          const data = await prisma.bookCategory.create({
            data: {
              book_category_name: bookCategoryName,
            },
          });

          return data;
        } catch (error) {
          throw error;
        }
      });
      return transaction;
    } catch (error) {
      throw error;
    }
  };
}
