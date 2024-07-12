import { jurnal, mutationJurnal } from '@/interfaces/jurnal.interfaces';
import {
  WarehouseStockWithWarehouse,
  addStock,
  removeStock,
  updateStockMutation,
  warehouseStock,
} from '@/interfaces/stock.interface';
import prisma from '@/prisma';
import {
  Book,
  CartItem,
  Prisma,
  Warehouse,
  WarehouseStock,
} from '@prisma/client';
import Container, { Service } from 'typedi';
import { JurnalQuery } from './jurnal.query';
import { HttpException } from '@/exceptions/http.exception';
import { IfetchProductNotAddedYet } from '@/interfaces/warehouseStock.interface';

@Service()
export class StockQuery {
  jurnalquery = Container.get(JurnalQuery);
  public addProductToWarehouseStockQuery = async (
    param: warehouseStock,
  ): Promise<WarehouseStock> => {
    try {
      const transactions = await prisma.$transaction(async () => {
        try {
          const { bookId, warehouseId, qty } = param;
          //1. check apakah udah di add ke warehousenya product ini
          const check = await prisma.warehouseStock.findFirst({
            where: {
              book_id: bookId,
              warehouse_id: warehouseId,
            },
          });
          //2. masukin warehouse stock table
          if (check)
            throw new Error(
              'Product already add to the warehouse, suggest to supply the stock',
            );
          const data = await prisma.warehouseStock.create({
            data: {
              book_id: bookId,
              warehouse_id: warehouseId,
              stockQty: qty || 0,
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

  public checkWarehouseStockByWarehouse = async (
    warehouseId: number,
  ): Promise<WarehouseStockWithWarehouse> => {
    try {
      const wStock = await prisma.warehouseStock.findFirst({
        where: {
          warehouse_id: warehouseId,
        },
        include: {
          warehouse: true,
        },
      });
      return wStock;
    } catch (error) {
      throw error;
    }
  };

  public addStockQuery = async (param: addStock): Promise<jurnal> => {
    try {
      const transactions = await prisma.$transaction(async () => {
        try {
          const { id, stockAddition } = param;
          //1. find productnya udah ada di warehouse atau blm sebelum ditambahkan
          const isProductAtWarehouse = await prisma.warehouseStock.findFirst({
            where: {
              id,
            },
            include: {
              book: true,
              warehouse: true,
            },
          });
          if (!isProductAtWarehouse)
            throw new Error('Please add the product first to this warehouse');
          //2. masukin tambahan stocknya ke table warehouse stock
          const warehouseStockProduct = await prisma.warehouseStock.update({
            data: {
              stockQty: isProductAtWarehouse.stockQty + stockAddition,
            },
            include: {
              warehouse: true,
              book: true,
            },
            where: {
              id,
            },
          });
          //3. update jurnal penambahannya
          const jurnal = await prisma.jurnalStock.create({
            data: {
              warehouseStockId: warehouseStockProduct.id,
              oldStock: isProductAtWarehouse.stockQty,
              newStock: warehouseStockProduct.stockQty,
              stockChange: stockAddition,
              type: 'PLUS',
              message: `${stockAddition} ${isProductAtWarehouse.book.book_name} book(s) successfully added to warehouse ${isProductAtWarehouse.warehouse.warehouse_name}`,
            },
            include: {
              warehouseStock: {
                include: {
                  warehouse: true,
                },
              },
            },
          });
          return jurnal;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public removeStockQuery = async (param: removeStock) => {
    try {
      const transactions = await prisma.$transaction(async () => {
        try {
          const { id, stockSubtraction } = param;
          //1. find productnya udah ada di warehouse atau blm sebelum ditambahkan
          const isProductAtWarehouse = await prisma.warehouseStock.findFirst({
            where: {
              id,
            },
            include: {
              book: true,
              warehouse: true,
            },
          });
          if (!isProductAtWarehouse) throw new Error('Product is not valid');
          //2. masukin tambahan stocknya ke table warehouse stock
          const warehouseStockProduct = await prisma.warehouseStock.update({
            data: {
              stockQty: isProductAtWarehouse.stockQty - stockSubtraction,
            },
            include: {
              warehouse: true,
              book: true,
            },
            where: {
              id,
            },
          });
          //3. update jurnal penambahannya
          const jurnal = await prisma.jurnalStock.create({
            data: {
              warehouseStockId: warehouseStockProduct.id,
              oldStock: isProductAtWarehouse.stockQty,
              newStock: warehouseStockProduct.stockQty,
              stockChange: stockSubtraction,
              type: 'MINUS',
              message: `${stockSubtraction} ${isProductAtWarehouse.book.book_name} book(s) successfully removed from warehouse ${isProductAtWarehouse.warehouse.warehouse_name}`,
            },
            include: {
              warehouseStock: {
                include: {
                  warehouse: true,
                },
              },
            },
          });
          return jurnal;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public fetchAllProductAtSelectedWarehouseQuery = async (
    warehouseId: number,
  ): Promise<WarehouseStock[]> => {
    try {
      const data = await prisma.warehouseStock.findMany({
        where: {
          warehouse_id: warehouseId,
        },
        include: {
          book: {
            include: {
              bookCategory: true,
            },
          },
          warehouse: true,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  public fetchProductNotAddedYetQuery = async (
    warehouseId: number,
    page: number,
    limit: number,
    search: string,
  ): Promise<IfetchProductNotAddedYet> => {
    try {
      let query: Prisma.BookFindManyArgs = {
        where: {
          AND: [
            {
              WarehouseStock: {
                none: {
                  warehouse_id: warehouseId,
                },
              },
            },
            search
              ? {
                  book_name: {
                    contains: search,
                  },
                }
              : {},
          ],
        },
        include: {
          bookCategory: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      };
      if (page && limit) {
        query = { ...query, skip: (page - 1) * limit, take: limit };
      }
      // const productList = await prisma.book.findMany(query);

      const [products, count] = await prisma.$transaction([
        prisma.book.findMany(query),
        prisma.book.count({ where: query.where }),
      ]);
      const totalPage = Math.ceil(count / limit);

      return { products, totalPage };
    } catch (error) {
      throw error;
    }
  };

  public checkProductStockAtWarehouse = async (
    warehouseId: number,
    productId: number,
  ): Promise<WarehouseStock> => {
    try {
      const checkStock = await prisma.warehouseStock.findFirst({
        where: {
          warehouse_id: warehouseId,
          book_id: productId,
        },
      });
      return checkStock;
    } catch (error) {
      throw error;
    }
  };

  public updateStockAfterMutationQuery = async ({
    senderWarehouseId,
    receiverWarehouseId,
    bookId,
    qty,
  }: updateStockMutation) => {
    try {
      await prisma.$transaction(async () => {
        try {
          //1. validasi dulu  warehouse sender
          const senderInvent = await prisma.warehouseStock.findFirst({
            where: {
              warehouse_id: senderWarehouseId,
              book_id: bookId,
            },
          });
          //2. validasi dulu  warehouse receiver
          const receiverInvent = await prisma.warehouseStock.findFirst({
            where: {
              warehouse_id: receiverWarehouseId,
              book_id: bookId,
            },
          });
          if (!senderInvent && !receiverInvent) {
            throw new Error(
              'The warehouse is not capable of sending or receiving stock.',
            );
          }
          //3. validasi stocknya cukup atau engga
          if (receiverInvent.stockQty - qty < 0) {
            throw new Error(
              'The warehouse stock is not sufficient for this mutation',
            );
          }
          //4. kurangi stock di receiver (yg terima request mutation)
          const latestReceiverStock = receiverInvent.stockQty - qty;
          await prisma.warehouseStock.update({
            data: {
              stockQty: latestReceiverStock,
            },
            where: {
              id: receiverInvent.id,
            },
          });
          const latestSenderStock = senderInvent.stockQty + qty;
          //5. tambah stock di sender (yg kirim request mutation)
          await prisma.warehouseStock.update({
            data: {
              stockQty: latestSenderStock,
            },
            where: {
              id: senderInvent.id,
            },
          });
          //6. update jurnal pengeluaran pemasukan
          const jurnal: mutationJurnal = {
            receiverInvent,
            latestReceiverStock,
            senderInvent,
            latestSenderStock,
            qty,
          };
          await this.jurnalquery.insertMutationJurnalQuery(jurnal);
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  };

  public updateStockAfterTransactionQuery = async ({
    oldQty,
    newQty,
    stockId,
    transId,
  }) => {
    try {
      const updateInventory = await prisma.warehouseStock.update({
        where: {
          id: stockId,
        },
        data: {
          stockQty: newQty,
        },
        include: {
          book: true,
        },
      });

      //catat jurnal pengurangannya

      await prisma.jurnalStock.create({
        data: {
          oldStock: oldQty,
          newStock: newQty,
          stockChange: Math.abs(newQty - oldQty),
          type: 'MINUS',
          warehouseStockId: stockId,
          message: `${updateInventory.book.book_name} out for order in TransactionID : ${transId}`,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  public deleteProductStockQuery = async (id: number) => {
    try {
      const check = await prisma.warehouseStock.findFirst({
        where: { id },
        include: {
          warehouse: true,
          book: true,
        },
      });
      const oldStock = check?.stockQty;
      if (!check) throw new Error('Product is not exist anymore');
      const deleteProduct = await prisma.warehouseStock.delete({
        where: {
          id,
        },
      });

      //catat jurnal minus kalo ke delete
      // await prisma.jurnalStock.create({
      //   data: {
      //     type: 'MINUS',
      //     warehouseStockId: check.id,
      //     oldStock,
      //     newStock: 0,
      //     stockChange: oldStock,
      //     message: `${check.book.book_name} books has been deleted in warehouse ${check.warehouse.warehouse_name}`,
      //   },
      // });
      return deleteProduct;
    } catch (error) {
      throw error;
    }
  };

  public returnStockAfterCanceledQuery = async (
    transactionId: number,
    cartItem: CartItem[],
    warehouseId: number,
  ) => {
    try {
      //balikin stock barang di list cart ke warehosue yg tercantum di transaction
      for (const item of cartItem) {
        const warehouseStock = await prisma.warehouseStock.findFirst({
          where: { warehouse_id: warehouseId, book_id: item.book_id },
          include: {
            book: true,
            warehouse: true,
          },
        });
        if (!warehouseStock)
          throw new HttpException(
            400,
            `Warehouse ${warehouseStock.warehouse.warehouse_name} does not have ${warehouseStock.book.book_name} book(s)`,
          );
        const oldQty = warehouseStock.stockQty;
        //update warehouse stock
        const updatedStock = await prisma.warehouseStock.update({
          where: {
            id: warehouseStock.id,
          },
          data: {
            stockQty: oldQty + item.quantity,
          },
        });

        //update jurnal
        await prisma.jurnalStock.create({
          data: {
            warehouseStockId: warehouseStock.id,
            oldStock: oldQty,
            newStock: updatedStock.stockQty,
            stockChange: item.quantity,
            type: 'PLUS',
            message: `Return stock from order with Transaction ID: ${transactionId}`,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };
}
