import { Service } from 'typedi';
import { product } from '@/interfaces/product.interface';
import prisma from '@/prisma';
import { Book, BookImage, Prisma } from '@prisma/client';
import { join } from 'path';
import fs from 'fs';
import { deleteHypeninString } from '@/utils/convert.utils';

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

  public checkProductForUpdate = async (id: number, name: string) => {
    try {
      const res = await prisma.book.findFirst({
        where: {
          book_name: name,
          NOT: {
            id,
          },
        },
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  public createProductQuery = async (
    params: product,
    files: Express.Multer.File[],
  ) => {
    try {
      const transactions = await prisma.$transaction(async () => {
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
          const images = files.map((el) => ({
            book_image: el.filename,
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
              primary_image: files[0]?.filename || '',
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
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductQuery = async (id: number) => {
    try {
      const transactions = await prisma.$transaction(async () => {
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
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public getAllProductsQuery = async (
    page: number,
    limit: number,
    category: string,
    sortBy: string,
    search: string,
  ) => {
    try {
      let sortOrder = [];
      if (sortBy === 'newest') {
        sortOrder.push({
          created_at: 'desc',
        });
      } else if (sortBy === 'highest') {
        sortOrder.push({
          book_price: 'desc',
        });
      } else if (sortBy === 'lowest') {
        sortOrder.push({
          book_price: 'asc',
        });
      }
      const totalDataInDatabase = await prisma.book.count();
      const skipPage = (page - 1) * limit || 0;
      const take = limit ?? totalDataInDatabase;
      const data = await prisma.book.findMany({
        skip: skipPage,
        take,
        include: {
          bookCategory: true,
        },
        where: {
          AND: [
            {
              bookCategory: {
                book_category_name: {
                  startsWith: category,
                },
              },
            },
            {
              book_name: {
                contains: search,
              },
            },
          ],
        },
        orderBy: sortOrder,
      });

      const allData = await prisma.book.findMany({
        include: {
          bookCategory: true,
        },
        where: {
          bookCategory: {
            book_category_name: {
              startsWith: category,
            },
          },
        },
      });

      const countData = allData.length;
      const totalPages = Math.ceil(countData / limit) || 1;

      const res = {
        data,
        page,
        limit,
        totalData: countData,
        totalPages,
      };

      return res;
    } catch (error) {
      throw error;
    }
  };

  public getProductQuery = async (book_name: string) => {
    try {
      const bookName = deleteHypeninString(book_name);
      const data = await prisma.book.findFirstOrThrow({
        where: {
          book_name: bookName,
        },
        include: {
          BookImage: true,
          bookCategory: true,
          WarehouseStock: true,
        },
      });

      const countStock = await prisma.warehouseStock.groupBy({
        by: ['book_id'],
        _sum: {
          stockQty: true,
        },
        where: {
          book: {
            book_name: bookName,
          },
        },
      });
      return { ...data, current_stock: countStock[0]?._sum?.stockQty || 0 };
    } catch (error) {
      throw error;
    }
  };

  public updateProductQuery = async (
    param: Book,
    files: Express.Multer.File[],
  ) => {
    try {
      const transactions = await prisma.$transaction(async () => {
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
          }));

          //fetch list images of the book
          const prevImg = await prisma.bookImage.findMany({
            where: { book_id: Number(id) },
          });

          //set primary photo product //if current image list is empty, then add primary into new image list
          const primary = prevImg.length
            ? prevImg[0].book_image
            : files[0].filename;

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
              primary_image: primary || '',
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

          return data;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductImageQuery = async (imageId: number) => {
    try {
      const del = await prisma.bookImage.delete({
        where: {
          id: imageId,
        },
      });
      const dir = join(__dirname, '../public/', 'products');
      if (del) {
        fs.unlinkSync(dir + '/' + del.book_image);
      }
      return del;
    } catch (error) {
      throw error;
    }
  };

  public getAllProductsDashboardQuery = async (
    page: number,
    limit: number,
    category: string,
    sortBy: string,
    search: string,
    order: string,
  ) => {
    try {
      const totalDataInDatabase = await prisma.book.count();
      const skipPage = (page - 1) * limit || 0;
      const take = limit ?? totalDataInDatabase;

      let sortQuery: Prisma.BookOrderByWithRelationInput = {};
      if (sortBy && order !== 'UNSORT') {
        sortQuery = {
          [sortBy]: order === 'ASC' ? 'asc' : 'desc',
        };
      }

      const query = {
        skip: skipPage,
        take,
        include: {
          bookCategory: true,
        },
        where: {
          AND: [
            {
              bookCategory: {
                book_category_name: {
                  startsWith: category,
                },
              },
            },
            {
              OR: [
                {
                  book_name: {
                    contains: search,
                  },
                },
                {
                  bookCategory: {
                    book_category_name: {
                      contains: search,
                    },
                  },
                },
                {
                  book_author: {
                    contains: search,
                  },
                },
              ],
            },
          ],
        },
        orderBy: sortQuery,
      } satisfies Prisma.BookFindManyArgs;

      const [books, count] = await prisma.$transaction([
        prisma.book.findMany(query),
        prisma.book.count({ where: query.where }),
      ]);

      const totalPages = Math.ceil(count / limit) || 1;

      const res = {
        data: books,
        page,
        limit,
        totalData: count,
        totalPages,
      };

      return res;
    } catch (error) {
      throw error;
    }
  };

  public getListProductNameQuery = async () => {
    try {
      const listProduct = await prisma.book.findMany({
        select: {
          id: true,
          book_name: true,
        },
      });
      return listProduct;
    } catch (error) {
      throw error;
    }
  };
}
