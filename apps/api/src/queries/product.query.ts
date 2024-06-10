import { Service } from 'typedi';
import { product } from '@/interfaces/product.interface';
import prisma from '@/prisma';
import { Book, BookImage } from '@prisma/client';
import { join } from 'path';
import fs from 'fs';

@Service()
export class ProductQuery {
  public checkProduct = async (
    basedOn: string,
    param: string | number,
  ): Promise<Book> => {
    try {
      let clause: Object;
      if (basedOn === 'name') {
        clause = {
          book_name: param,
        };
      } else {
        clause = {
          id: param,
        };
      }
      const data = await prisma.book.findFirst({
        where: clause,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  public createProductQuery = async (
    params: product,
    files: Express.Multer.File[],
  ) => {
    try {
      const t = await prisma.$transaction(async () => {
        try {
          const {
            book_name,
            book_description,
            book_author,
            book_publisher,
            book_published_year,
            book_category_id,
            book_ISBN,
            book_price,
            book_weight,
          } = params;
          //   insert data on table Book
          const images = files.map((el, idx: number) => ({
            book_image: el.filename,
            order: idx + 1,
          }));
          const data = await prisma.book.create({
            data: {
              book_name,
              book_description,
              book_author,
              book_publisher,
              book_published_year: Number(book_published_year),
              book_category_id: Number(book_category_id),
              book_ISBN,
              book_price: Number(book_price),
              book_weight: Number(book_weight),
              BookImage: {
                createMany: {
                  data: images,
                },
              },
            },
            include: {
              BookImage: true,
            },
          });

          return data;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductQuery = async (id: number) => {
    try {
      const t = await prisma.$transaction(async () => {
        try {
          // get list images of product
          const imageList = await prisma.bookImage.findMany({
            where: {
              book_id: id,
            },
          });
          // delete it with delete cascade on book img
          const data = await prisma.book.delete({
            where: {
              id,
            },
            include: {
              BookImage: true,
            },
          });
          // delete actual files on directory
          if (imageList) {
            const dir = join(__dirname, '../public/', 'products');
            const imgStack = imageList.map((el: BookImage) => el.book_image);
            imgStack.forEach((image) => {
              fs.unlinkSync(dir + '/' + image);
            });
          }

          return data;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };

  public getAllProductsQuery = async () => {
    try {
      const data = await prisma.book.findMany();

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductQuery = async (book_name: string) => {
    try {
      const data = await prisma.book.findFirstOrThrow({
        where: {
          book_name,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  public updateProductQuery = async (
    param: Book,
    files: Express.Multer.File[],
  ) => {
    try {
      const t = await prisma.$transaction(async () => {
        try {
          const {
            id,
            book_name,
            book_description,
            book_author,
            book_publisher,
            book_published_year,
            book_category_id,
            book_ISBN,
            book_price,
            book_weight,
          } = param;
          const images = files.map((el, idx: number) => ({
            book_image: el.filename,
            order: idx + 1,
          }));

          //fetch list images of the book
          const prevImg = await prisma.bookImage.findMany({
            where: { book_id: Number(id) },
          });

          //delete all related book image
          const deleted = await prisma.bookImage.deleteMany({
            where: {
              book_id: Number(id),
            },
          });

          //update the data
          const data = await prisma.book.update({
            data: {
              book_name,
              book_description,
              book_author,
              book_publisher,
              book_published_year: Number(book_published_year),
              book_category_id: Number(book_category_id),
              book_ISBN,
              book_price: Number(book_price),
              book_weight: Number(book_weight),
              BookImage: {
                createMany: {
                  data: images,
                },
              },
            },
            where: {
              id: Number(id),
            },
          });

          //unlink sync all previous image
          if (prevImg) {
            const dir = join(__dirname, '../public/', 'products');
            prevImg.forEach((image) => {
              fs.unlinkSync(dir + '/' + image.book_image);
            });
          }

          return data;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };
}
