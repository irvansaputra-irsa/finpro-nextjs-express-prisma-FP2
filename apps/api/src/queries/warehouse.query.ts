import prisma from '@/prisma';
import { Service } from 'typedi';

@Service()
export class WarehouseQuery {
  public getAllWarehouseQuery = async () => {
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
}
