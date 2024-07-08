import prisma from '@/prisma';
import { Warehouse, WarehouseStock } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class WarehouseQuery {
  public getAllWarehouseQuery = async (
    restricted: boolean,
    role: string,
    id: number,
  ): Promise<Warehouse[]> => {
    try {
      let whereClause = {};
      if (restricted && role === 'admin') {
        whereClause = {
          warehouse_admin_id: id,
        };
      }
      const data = await prisma.warehouse.findMany({
        include: {
          user: true,
        },
        where: whereClause,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  public findWarehouseByUserQuery = async (id: number): Promise<Warehouse> => {
    try {
      const admin = await prisma.warehouse.findFirst({
        where: {
          warehouse_admin_id: id,
        },
      });
      return admin;
    } catch (error) {
      throw error;
    }
  };

  public getListWarehouseQuery = async (id: number, role: string) => {
    try {
      let whereClause = {};
      if (role !== 'super admin') {
        whereClause = {
          warehouse_admin_id: id,
        };
      }

      const listWarehouse = await prisma.warehouse.findMany({
        select: {
          id: true,
          warehouse_name: true,
          warehouse_city: true,
        },
        where: whereClause,
      });
      return listWarehouse;
    } catch (error) {
      throw error;
    }
  };

  public findListWarehouseByProduct = async (
    bookId: number,
    warehouseId: number,
  ) => {
    try {
      if (bookId && warehouseId) {
        const query = bookId
          ? {
              AND: [
                {
                  book_id: bookId,
                },
                {
                  stockQty: {
                    gt: 0,
                  },
                },
              ],
              NOT: {
                warehouse_id: warehouseId,
              },
            }
          : {};
        const listBook = await prisma.warehouseStock.findMany({
          where: query,
          include: {
            warehouse: true,
          },
        });
        return listBook;
      } else {
        const listWarehouse = await prisma.warehouse.findMany();
        return listWarehouse;
      }
    } catch (error) {
      throw error;
    }
  };
}
