import prisma from '@/prisma';
import { Warehouse } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class WarehouseQuery {
  public getAllWarehouseQuery = async (): Promise<Warehouse[]> => {
    try {
      const data = await prisma.warehouse.findMany({
        include: {
          user: true,
        },
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
}
