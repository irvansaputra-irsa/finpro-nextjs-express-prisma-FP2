import { WarehouseQuery } from '@/queries/warehouse.query';
import Container, { Service } from 'typedi';

@Service()
export class WarehouseService {
  warehouseQuery = Container.get(WarehouseQuery);
  public getAllWarehouseService = async () => {
    try {
      const data = await this.warehouseQuery.getAllWarehouseQuery();
      return data;
    } catch (error) {
      throw error;
    }
  };
}
