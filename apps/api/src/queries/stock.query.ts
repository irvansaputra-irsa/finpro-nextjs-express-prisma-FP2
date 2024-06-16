import { jurnal } from '@/interfaces/jurnal.interfaces';
import { addStock, warehouseStock } from '@/interfaces/stock.interface';
import prisma from '@/prisma';
import { Book, WarehouseStock } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class StockQuery {
  public addProductToWarehouseStockQuery = async (
    param: warehouseStock,
  ): Promise<WarehouseStock> => {
    try {
      //1. masukin warehouse stock table dulu
      const { bookId, warehouseId, qty } = param;
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
  };

  public checkWarehouseStock = async (id: number): Promise<WarehouseStock> => {
    try {
      const wStock = await prisma.warehouseStock.findFirst({
        where: {
          id,
        },
      });
      return wStock;
    } catch (error) {
      throw error;
    }
  };

  public addStockQuery = async (param: addStock): Promise<jurnal> => {
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
          type: 'Penambahan',
          message: `Buku ${isProductAtWarehouse.book.book_name} telah ditambahkan ke warehouse ${isProductAtWarehouse.warehouse.warehouse_name} sebanyak ${stockAddition} buah`,
        },
      });

      return jurnal;
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
      });
      return productList;
    } catch (error) {
      throw error;
    }
  };
}
