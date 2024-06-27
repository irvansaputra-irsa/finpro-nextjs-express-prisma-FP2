import { jurnal, mutationJurnal } from '@/interfaces/jurnal.interfaces';
import {
  WarehouseStockWithWarehouse,
  addStock,
  updateStockMutation,
  warehouseStock,
} from '@/interfaces/stock.interface';
import prisma from '@/prisma';
import { Book, Warehouse, WarehouseStock } from '@prisma/client';
import Container, { Service } from 'typedi';
import { JurnalQuery } from './jurnal.query';

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
              message: `Buku ${isProductAtWarehouse.book.book_name} telah ditambahkan ke warehouse ${isProductAtWarehouse.warehouse.warehouse_name} sebanyak ${stockAddition} buah`,
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
  ): Promise<Book[]> => {
    try {
      const productList = await prisma.book.findMany({
        where: {
          WarehouseStock: {
            none: {
              warehouse_id: warehouseId,
            },
          },
        },
        include: {
          bookCategory: true,
        },
      });
      return productList;
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
      });
      if (!check) throw new Error('Product is not exist anymore');
      const deleteProduct = await prisma.warehouseStock.delete({
        where: {
          id,
        },
      });
      return deleteProduct;
    } catch (error) {
      throw error;
    }
  };
}
