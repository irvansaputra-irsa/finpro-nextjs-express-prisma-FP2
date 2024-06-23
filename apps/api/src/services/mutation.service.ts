import { reqMutation, respMutation } from '@/interfaces/mutation.interface';
import prisma from '@/prisma';
import { MutationQuery } from '@/queries/mutation.query';
import { StockQuery } from '@/queries/stock.query';
import { Mutation } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class MutationService {
  mutationQuery = Container.get(MutationQuery);
  stockQuery = Container.get(StockQuery);
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
        throw new Error('Product is not available at those warehouse');
      }
      if (qty > 0) {
        if (checkReceiverWarehouse?.stockQty < qty) {
          throw new Error('Stock at requested warehouse is not enough');
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
      const mutate = await this.stockQuery.updateStockAfterMutationQuery({
        senderWarehouseId: findMutation.from_warehouse_id,
        receiverWarehouseId: findMutation.to_warehouse_id,
        bookId: findMutation.book_id,
        qty: findMutation.quantity,
      });
      // 3. update status mutation ke COMPLETED
      await this.mutationQuery.acceptMutationQuery(params);
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

  public getAllMutationService = async () => {
    try {
      const data = await this.mutationQuery.getAllMutationQuery();
      return data;
    } catch (error) {
      throw error;
    }
  };
}
