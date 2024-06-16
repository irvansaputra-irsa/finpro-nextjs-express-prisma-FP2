import { jurnal } from '@/interfaces/jurnal.interfaces';
import { warehouseStock, addStock } from '@/interfaces/stock.interface';
import { ProductQuery } from '@/queries/product.query';
import { StockQuery } from '@/queries/stock.query';
import { Book, WarehouseStock } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class StockService {
  stockQuery = Container.get(StockQuery);
  productQuery = Container.get(ProductQuery);
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

  public fetchAllProductAtSelectedWarehouseService = async (
    id: number,
  ): Promise<WarehouseStock[]> => {
    try {
      // 1. cek di WAREHOUSE admin tsb atau bukan
      // super admin trabas aja
      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data =
        await this.stockQuery.fetchAllProductAtSelectedWarehouseQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public fetchProductNotAddedYetService = async (
    id: number,
  ): Promise<Book[]> => {
    try {
      // 1. cek di WAREHOUSE admin tsb atau bukan
      // super admin trabas aja
      // 2. baru insert qtynya sesuai warehouse id dan product id
      const data = await this.stockQuery.fetchProductNotAddedYetQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
