import prisma from '@/prisma';
import { Service } from 'typedi';
import { BookCategory } from '@prisma/client';
import { productCategory } from '@/interfaces/productCategory.interface';

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

  public getProductCategoriesQuery = async (): Promise<BookCategory[]> => {
    try {
      const data = await prisma.bookCategory.findMany();

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductCategoryQuery = async (
    id: number,
  ): Promise<BookCategory> => {
    try {
      const data = await prisma.bookCategory.findFirstOrThrow({
        where: {
          id,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  public updateProductCategoryQuery = async (
    param: productCategory,
  ): Promise<BookCategory> => {
    try {
      const transaction = await prisma.$transaction(async () => {
        try {
          const { bookCategoryName } = param;

          const data = await prisma.bookCategory.update({
            where: { id: param.bookCategoryId },
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

  public deleteProductCategoryQuery = async (
    id: number,
  ): Promise<BookCategory> => {
    try {
      const transaction = await prisma.$transaction(async () => {
        try {
          const data = await prisma.bookCategory.delete({
            where: { id },
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

  public checkCategoryOnProduct = async (id: number) => {
    try {
      const isRelateOnProduct = await prisma.book.findFirst({
        where: {
          book_category_id: id,
        },
      });
      return isRelateOnProduct;
    } catch (error) {
      throw error;
    }
  };
}
