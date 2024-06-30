import { WarehouseQuery } from '@/queries/warehouse.query';
import { Warehouse } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class WarehouseService {
  warehouseQuery = Container.get(WarehouseQuery);
  public getAllWarehouseService = async (
    restricted: boolean,
    role: string,
    id: number,
  ): Promise<Warehouse[]> => {
    try {
      const data = await this.warehouseQuery.getAllWarehouseQuery(
        restricted,
        role,
        id,
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  public findWarehouseByUserService = async (
    id: number,
  ): Promise<Warehouse> => {
    try {
      const data = await this.warehouseQuery.findWarehouseByUserQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public getListWarehouseService = async (id: number, role: string) => {
    try {
      // CHECK BY TOKEN
      // harusnya dicek super-admin atau bukan
      // kalo dia warehouse admin biasa, lempar id usernya, biar nnti di where by warehoue_admin_id
      const data = await this.warehouseQuery.getListWarehouseQuery(id, role);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
