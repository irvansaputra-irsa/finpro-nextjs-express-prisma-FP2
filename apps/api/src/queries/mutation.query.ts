import {
  getMutation,
  minusStock,
  plusStock,
  reqMutation,
  respMutation,
} from '@/interfaces/mutation.interface';
import prisma from '@/prisma';
import { Mutation, Prisma } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class MutationQuery {
  public requestMutationProductQuery = async (
    params: reqMutation,
  ): Promise<Mutation> => {
    try {
      const {
        receiverWarehouseId,
        senderWarehouseId,
        bookId,
        qty,
        senderName,
        senderNotes,
      } = params;
      const transactions = await prisma.$transaction(async () => {
        try {
          const mutation = await prisma.mutation.create({
            data: {
              book_id: bookId,
              to_warehouse_id: receiverWarehouseId,
              from_warehouse_id: senderWarehouseId,
              quantity: qty,
              status: 'PROCESSED',
              sender_notes: senderNotes,
              sender_name: senderName,
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public acceptMutationQuery = async (
    params: respMutation,
  ): Promise<Mutation> => {
    try {
      const transactions = await prisma.$transaction(async () => {
        try {
          const { id, receiverName, receiverNotes = null } = params;
          const mutation = await prisma.mutation.update({
            where: {
              id,
            },
            data: {
              status: 'COMPLETED',
              receiver_name: receiverName,
              receiver_notes: receiverNotes,
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public findMutationOnProcessedQuery = async (id: number) => {
    try {
      const find = await prisma.mutation.findFirst({
        where: {
          id,
          status: 'PROCESSED',
        },
      });
      return find;
    } catch (error) {
      throw error;
    }
  };

  public rejectMutationQuery = async (params: respMutation) => {
    try {
      const transactions = await prisma.$transaction(async () => {
        try {
          const { id, receiverNotes = null, receiverName } = params;
          const mutation = await prisma.mutation.update({
            where: {
              id,
            },
            data: {
              receiver_name: receiverName,
              receiver_notes: receiverNotes,
              status: 'REJECTED',
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };
  public cancelMutationQuery = async (mutationId: number) => {
    try {
      const transactions = await prisma.$transaction(async () => {
        try {
          const mutation = await prisma.mutation.update({
            where: {
              id: mutationId,
            },
            data: {
              status: 'CANCELED',
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public getWarehouseMutationQuery = async (param: getMutation) => {
    try {
      const { id, pageIncoming = 0, pageOutcoming = 0, limit } = param;
      const skipIncome = pageIncoming ? (pageIncoming - 1) * limit : 0;
      const queryIncoming = {
        where: {
          to_warehouse_id: id,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          from_warehouse: true,
          book: true,
        },
        skip: skipIncome,
        take: limit,
      } satisfies Prisma.MutationFindManyArgs;

      const [incoming, countIncoming] = await prisma.$transaction([
        prisma.mutation.findMany(queryIncoming),
        prisma.mutation.count({ where: queryIncoming.where }),
      ]);

      const skipOutcome = pageOutcoming ? (pageOutcoming - 1) * limit : 0;
      const queryOutcoming = {
        where: {
          from_warehouse_id: id,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          to_warehouse: true,
          book: true,
        },
        skip: skipOutcome,
        take: limit,
      } satisfies Prisma.MutationFindManyArgs;
      const [outcoming, countOutcoming] = await prisma.$transaction([
        prisma.mutation.findMany(queryOutcoming),
        prisma.mutation.count({ where: queryOutcoming.where }),
      ]);

      const incomingRequest = {
        data: incoming,
        countIncoming,
        totalPageIncoming: Math.ceil(countIncoming / limit) || 1,
      };

      const outcomingRequest = {
        data: outcoming,
        countOutcoming,
        totalPageOutcoming: Math.ceil(countOutcoming / limit) || 1,
      };

      return { incomingRequest, outcomingRequest };
    } catch (error) {
      throw error;
    }
  };

  public updateStockMinusMutationQuery = async (param: minusStock) => {
    try {
      const { warehouseId, bookId, minus, warehouseName } = param;
      const inventory = await prisma.warehouseStock.findFirst({
        where: {
          warehouse_id: warehouseId,
          book_id: bookId,
        },
        include: {
          warehouse: true,
        },
      });
      if (!inventory)
        throw new Error(
          'Product is not found on ' + inventory.warehouse.warehouse_name,
        );
      const oldStock = inventory.stockQty;
      //update stock
      const dataMinus = await prisma.warehouseStock.update({
        where: {
          id: inventory.id,
        },
        data: {
          stockQty: Number(inventory.stockQty) - minus,
        },
      });

      //update jurnal pengeluaran
      await prisma.jurnalStock.create({
        data: {
          warehouseStockId: inventory.id,
          type: 'MINUS',
          oldStock,
          newStock: dataMinus.stockQty,
          stockChange: minus,
          message: `${minus} books out to warehouse ${warehouseName}`,
        },
      });
    } catch (error) {
      throw error;
    }
  };
  public updateStockPlusMutationQuery = async (param: plusStock) => {
    try {
      const { warehouseId, bookId, plus, warehouseName } = param;
      const inventory = await prisma.warehouseStock.findFirst({
        where: {
          warehouse_id: warehouseId,
          book_id: bookId,
        },
        include: {
          warehouse: true,
        },
      });
      if (!inventory)
        throw new Error(
          'Product is not found on ' + inventory.warehouse.warehouse_name,
        );
      const oldStock = inventory.stockQty;
      //update stock
      const dataPlus = await prisma.warehouseStock.update({
        where: {
          id: inventory.id,
        },
        data: {
          stockQty: Number(inventory.stockQty) + plus,
        },
      });

      //update jurnal penambahan
      await prisma.jurnalStock.create({
        data: {
          warehouseStockId: inventory.id,
          type: 'PLUS',
          oldStock,
          newStock: dataPlus.stockQty,
          stockChange: plus,
          message: `${plus} books in from warehouse ${warehouseName}`,
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
