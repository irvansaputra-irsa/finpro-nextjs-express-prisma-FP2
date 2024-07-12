import { HttpException } from '@/exceptions/http.exception';
import { jurnal } from '@/interfaces/jurnal.interfaces';
import {
  warehouseStock,
  addStock,
  removeStock,
} from '@/interfaces/stock.interface';
import { IfetchProductNotAddedYet } from '@/interfaces/warehouseStock.interface';
import { ProductQuery } from '@/queries/product.query';
import { StockQuery } from '@/queries/stock.query';
import { WarehouseQuery } from '@/queries/warehouse.query';
import { User } from '@/types/express';
import { Book, WarehouseStock } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class StockService {
  stockQuery = Container.get(StockQuery);
  productQuery = Container.get(ProductQuery);
  warehouseQuery = Container.get(WarehouseQuery);
  public addProductToWarehouseStockService = async (
    param: warehouseStock,
  ): Promise<WarehouseStock> => {
    try {
      const { bookId, warehouseId } = param;
      // 1. cek yang masukin datanya WAREHOUSE admin di WAREHOUSE tersebut atau buakn
      // kalau bukan ya throw error
      // kalau iya lanjut
      // kalau super admin juga lanjut

      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data = await this.stockQuery.addProductToWarehouseStockQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public addStockService = async (param: addStock): Promise<jurnal> => {
    try {
      // 1. cek yang masukin datanya WAREHOUSE admin di WAREHOUSE tersebut atau buakn
      // kalau bukan ya throw error
      // kalau iya lanjut
      // kalau super admin juga lanjut
      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data = await this.stockQuery.addStockQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public removeStockService = async (param: removeStock): Promise<jurnal> => {
    try {
      // 1. cek yang masukin datanya WAREHOUSE admin di WAREHOUSE tersebut atau buakn
      // kalau bukan ya throw error
      // kalau iya lanjut
      // kalau super admin juga lanjut
      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data = await this.stockQuery.removeStockQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public fetchAllProductAtSelectedWarehouseService = async (
    warehouseId: number,
    user: User,
    restricts: boolean,
  ): Promise<WarehouseStock[]> => {
    try {
      // 1. cek di WAREHOUSE admin tsb atau bukan
      // super admin trabas aja
      if (user?.role?.toLowerCase() === 'admin' && restricts) {
        const warehouse = await this.warehouseQuery.findWarehouseByUserQuery(
          user?.id,
        );
        if (warehouse?.id !== warehouseId) {
          throw new HttpException(403, 'Unauthorized');
        }
      }
      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data =
        await this.stockQuery.fetchAllProductAtSelectedWarehouseQuery(
          warehouseId,
        );
      return data;
    } catch (error) {
      throw error;
    }
  };

  public fetchProductNotAddedYetService = async (
    warehouseId: number,
    user: User,
    page: number,
    limit: number,
    search: string,
  ): Promise<IfetchProductNotAddedYet> => {
    try {
      // 1. cek di WAREHOUSE admin tsb atau bukan
      // super admin trabas aja
      if (user?.role?.toLowerCase() === 'admin') {
        const warehouse = await this.warehouseQuery.findWarehouseByUserQuery(
          user?.id,
        );
        if (warehouse?.id !== warehouseId) {
          throw new HttpException(403, 'Unauthorized');
        }
      }
      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data = await this.stockQuery.fetchProductNotAddedYetQuery(
        warehouseId,
        page,
        limit,
        search,
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductStockService = async (id: number) => {
    try {
      const data = await this.stockQuery.deleteProductStockQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
