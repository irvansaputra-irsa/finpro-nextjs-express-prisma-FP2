import { HttpException } from '@/exceptions/http.exception';
import {
  getMutation,
  reqMutation,
  respMutation,
} from '@/interfaces/mutation.interface';
import { nearestWarehouse } from '@/interfaces/nearestWarehouse';
import prisma from '@/prisma';
import { MutationQuery } from '@/queries/mutation.query';
import { StockQuery } from '@/queries/stock.query';
import { WarehouseQuery } from '@/queries/warehouse.query';
import { Mutation, Warehouse, WarehouseStock } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class MutationService {
  mutationQuery = Container.get(MutationQuery);
  stockQuery = Container.get(StockQuery);
  warehouseQuery = Container.get(WarehouseQuery);
  public requestMutationProductService = async (
    params: reqMutation,
  ): Promise<Mutation> => {
    try {
      const { senderWarehouseId, receiverWarehouseId, bookId, qty } = params;
      if (senderWarehouseId === receiverWarehouseId) {
        throw new Error('Please send mutation request to another warehouse'); // validasi mutation req TIDAK KE warehousenya sendiri
      }
      //1. check barang yg di request ada atau enggak di warehouse tsb
      const checkReceiverWarehouse =
        await this.stockQuery.checkProductStockAtWarehouse(
          receiverWarehouseId,
          bookId,
        );
      if (!checkReceiverWarehouse) {
        throw new HttpException(
          409,
          'Product is not available at those warehouse',
        );
      }
      if (qty > 0) {
        if (checkReceiverWarehouse?.stockQty < qty) {
          throw new HttpException(
            409,
            'Stock at requested warehouse is not enough',
          );
        }
      } else {
        throw new Error('Please input valid stock');
      }
      //optional, create warehouse stocknya di sender warehouse [kalo gak ada]
      const checkSenderWarehouse =
        await this.stockQuery.checkProductStockAtWarehouse(
          senderWarehouseId,
          bookId,
        );
      if (!checkSenderWarehouse) {
        const paramsAddProduct = {
          bookId: bookId,
          warehouseId: senderWarehouseId,
          qty: 0,
        };
        await this.stockQuery.addProductToWarehouseStockQuery(paramsAddProduct);
      }

      //2. baru bisa request barangnya
      const data = await this.mutationQuery.requestMutationProductQuery(params);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public acceptMutationService = async (params: respMutation) => {
    try {
      const { id } = params;
      //1. check apakah mutation id nya valid atau gak, return Canceled
      const findMutation =
        await this.mutationQuery.findMutationOnProcessedQuery(id);
      if (!findMutation)
        throw new Error(
          'Mutation is not valid, request has been canceled or already completed',
        );
      //2. update stock di receiver dan sender warehouse - [check dulu stocknya masih memenuhi atau tidak saat mau di confirm]
      await this.stockQuery.updateStockAfterMutationQuery({
        senderWarehouseId: findMutation.from_warehouse_id,
        receiverWarehouseId: findMutation.to_warehouse_id,
        bookId: findMutation.book_id,
        qty: findMutation.quantity,
      });
      // 3. update status mutation ke COMPLETED
      const mutate = await this.mutationQuery.acceptMutationQuery(params);
      return mutate;
    } catch (error) {
      throw error;
    }
  };

  public rejectMutationService = async (params: respMutation) => {
    try {
      const { id } = params;
      //1. check apakah mutation id nya valid atau gak, return Canceled
      const findMutation =
        await this.mutationQuery.findMutationOnProcessedQuery(id);
      if (!findMutation)
        throw new Error(
          'Mutation is not valid, request has been canceled or already completed',
        );
      // 2. update status mutation ke REJECTED
      const mutate = await this.mutationQuery.rejectMutationQuery(params);
      return mutate;
    } catch (error) {
      throw error;
    }
  };

  public cancelMutationService = async (id: number) => {
    try {
      //1. check apakah mutation id nya valid atau gak, return Canceled
      const findMutation =
        await this.mutationQuery.findMutationOnProcessedQuery(id);
      if (!findMutation)
        throw new Error(
          'Mutation is not valid, request has been canceled or already completed',
        );
      // 2. update status mutation ke CANCELED
      const mutate = await this.mutationQuery.cancelMutationQuery(id);
      return mutate;
    } catch (error) {
      throw error;
    }
  };

  public getWarehouseMutationService = async (param: getMutation) => {
    try {
      const data = await this.mutationQuery.getWarehouseMutationQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public orderStock = async (transactionId, orderDetails, currentWarehouse) => {
    console.log('test order stock');
    try {
      for (const order of orderDetails) {
        const inventory = await this.stockQuery.checkProductStockAtWarehouse(
          currentWarehouse.id,
          order.book_id,
        );
        if (!inventory) throw new Error('Product stock is not valid');
        //update current warehouse stock
        const oldQty = inventory.stockQty;
        const newQty = inventory.stockQty - order.quantity;
        await this.stockQuery.updateStockAfterTransactionQuery({
          oldQty,
          newQty,
          stockId: inventory.id,
          transId: transactionId,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  public verifyStock = async (orderDetails, currentWarehouse) => {
    try {
      let currentStock;
      for (const order of orderDetails) {
        // check dulu stocknya di warehouse current / tujuan
        currentStock = await this.stockQuery.checkProductStockAtWarehouse(
          currentWarehouse.id,
          order.book_id,
        );
        // kalo gak ada warehouse stock sama sekali alias gak ada rownya, buat 1 row baru isinya 0 qty
        if (!currentStock) {
          currentStock = await this.stockQuery.addProductToWarehouseStockQuery({
            bookId: order.book_id,
            warehouseId: currentWarehouse.id,
            qty: 0,
          });
        }
        // kalo stocknya gak cukup, mutasi stocknya dari warehouse lain
        if (order.quantity > currentStock.stockQty) {
          const remainingStock = order.quantity - currentStock.stockQty;
          await this.distributeMutationStock(
            currentWarehouse.id,
            order.book_id,
            currentWarehouse.lat,
            currentWarehouse.long,
            remainingStock,
          );
        }
      }
      return currentStock;
    } catch (error) {
      throw error;
    }
  };

  public distributeMutationStock = async (
    warehouseId,
    bookId,
    lat,
    long,
    remainingStock,
  ) => {
    try {
      console.log('test distribute stock');
      //re-check
      const currentWarehouse =
        await this.stockQuery.checkWarehouseStockByWarehouse(warehouseId);
      // ini kondisi kalo stock di warehouse yg di CO, ada kurang quanitity-nya
      const listWarehouse = await this.findNearestWarehouseService(
        lat,
        long,
        warehouseId,
        bookId,
      ); // sudah di sort by nearest

      //re-check remaining quantity dr warehouse lain cukup atau gak
      const sumRemainingQuantity = listWarehouse.reduce(
        (total, current) => total + current.stockAvailable,
        0,
      );
      if (remainingStock > sumRemainingQuantity) {
        throw new Error(
          'Remaining stock does not enough to fulfill this order',
        );
      }
      let stockRequired = remainingStock;
      let warehouseFlag = 0;
      //looping di semua list nearest warehouse
      while (stockRequired > 0) {
        const stockAvailableAtWarehouse =
          listWarehouse[warehouseFlag].stockAvailable;
        if (stockAvailableAtWarehouse <= stockRequired) {
          //case : stock req = 15 stock di warehouse = 10
          //1. stock remainingnya berkurang sesuai stock yg ada di warehouse tsb
          stockRequired -= stockAvailableAtWarehouse;

          //2. stock di warehouse LIST berkurang
          const stockMinus = stockAvailableAtWarehouse;
          await this.mutationQuery.updateStockMinusMutationQuery({
            warehouseId: Number(listWarehouse[warehouseFlag].warehouse),
            warehouseName: currentWarehouse.warehouse.warehouse_name,
            bookId,
            minus: stockMinus,
          });
          //3. stock di warehouse CURRENT bertambah
          const stockPlus = stockAvailableAtWarehouse;
          await this.mutationQuery.updateStockPlusMutationQuery({
            warehouseId,
            warehouseName: listWarehouse[warehouseFlag].warehouseName,
            bookId,
            plus: stockPlus,
          });
        } else if (stockAvailableAtWarehouse > stockRequired) {
          //case : stock req = 15 stock di warehouse = 16

          //1. stock di warehouse LIST berkurang
          const stockMinus = stockRequired;
          await this.mutationQuery.updateStockMinusMutationQuery({
            warehouseId: Number(listWarehouse[warehouseFlag].warehouse),
            warehouseName: currentWarehouse.warehouse.warehouse_name,
            bookId,
            minus: stockMinus,
          });
          //2. stock di warehouse CURRENT bertambah an
          const stockPlus = stockRequired;
          await this.mutationQuery.updateStockPlusMutationQuery({
            warehouseId,
            warehouseName: listWarehouse[warehouseFlag].warehouseName,
            bookId,
            plus: stockPlus,
          });
          //3. stock remaining/required jadi 0
          stockRequired = 0;
        }
        // NOTES : catat jurnal pengeluaran pemasukan pengeluaran

        if (warehouseFlag + 1 === listWarehouse.length && stockRequired > 0) {
          //kalo produknya emg ga mencukupi stoknya
          throw new Error('Stock is not enough for this product');
        }
        warehouseFlag++;
      }
    } catch (error) {
      throw error;
    }
  };

  public findNearestWarehouseService = async (
    lat: number,
    long: number,
    warehouseId = null,
    bookId = null,
  ): Promise<nearestWarehouse[]> => {
    try {
      //1. query list warehouse yg ada product tsb
      const listWarehouse =
        await this.warehouseQuery.findListWarehouseByProduct(
          bookId,
          warehouseId,
        );
      //2. buat list nearest warehouse pake haversine
      let sortedWarehouse = [];
      if (bookId && warehouseId) {
        const mapHaversineValue = listWarehouse.map((el, idx) => ({
          warehouse: el.warehouse_id,
          warehouseName: el.warehouse.warehouse_name,
          distance: this.haversineFormula(
            [lat, long],
            [el.warehouse.lat, el.warehouse.long],
          ),
          stockAvailable: el.stockQty,
          city: el?.warehouse.warehouse_city,
        }));
        sortedWarehouse = [...mapHaversineValue].sort(
          (a, b) => Number(a.distance) - Number(b.distance),
        );
      } else {
        const mapHaversineValue = listWarehouse.map((el, idx) => ({
          warehouse: el?.id,
          warehouseName: el?.warehouse_name,
          distance: this.haversineFormula([lat, long], [el?.lat, el?.long]),
          stockAvailable: 0,
          city: el?.warehouse_city,
        }));
        sortedWarehouse = [...mapHaversineValue].sort(
          (a, b) => Number(a.distance) - Number(b.distance),
        );
      }
      return sortedWarehouse;
    } catch (error) {
      throw error;
    }
  };

  public haversineFormula = ([lat1, lon1], [lat2, lon2]) => {
    try {
      const toRadian = (angle) => (Math.PI / 180) * angle;
      const distance = (a, b) => (Math.PI / 180) * (a - b);
      const RADIUS_OF_EARTH_IN_KM = 6371;

      const dLat = distance(lat2, lat1);
      const dLon = distance(lon2, lon1);

      lat1 = toRadian(lat1);
      lat2 = toRadian(lat2);

      // Haversine Formula
      const a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.asin(Math.sqrt(a));

      let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

      return finalDistance;
    } catch (error) {
      throw error;
    }
  };
}
