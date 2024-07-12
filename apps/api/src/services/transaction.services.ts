import Container, { Service } from 'typedi';
import { TransactionQuery } from '@/queries/transaction.queries';
import { CreateTransaction } from '@/interfaces/transaction.interfaces';
import prisma from '@/prisma';
import { Transaction } from '@prisma/client';
import { HttpException } from '@/exceptions/http.exception';
import { MutationService } from './mutation.service';
import { StockQuery } from '@/queries/stock.query';

@Service()
export class TransactionService {
  constructor(private readonly transactionQuery: TransactionQuery) {}
  mutationService = Container.get(MutationService);
  stockQuery = Container.get(StockQuery);
  public createTransactionService = async (
    param: CreateTransaction,
  ): Promise<Transaction> => {
    try {
      const data = await this.transactionQuery.createTransaction(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public confirmOrder = async (transactionId: number): Promise<void> => {
    try {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'completed' },
      });
    } catch (error) {
      throw error;
    }
  };

  public updateTransactionStatus = async (
    transactionId: number,
    status: string,
  ): Promise<void> => {
    try {
      if (status === 'on delivery') {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status,
            confirmation_date: new Date(),
          },
        });
      } else {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  public cronUpdateStatus = async () => {
    try {
      await this.transactionQuery.cronUpdateStatus();
    } catch (error) {
      throw error;
    }
  };

  public acceptTransactionOrder = async (transactionId: number) => {
    try {
      const findOrder = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
        },
        include: {
          cart: {
            include: {
              CartItem: true,
            },
          },
        },
      });
      if (!findOrder) throw new HttpException(400, 'Order does not exist');
      if (findOrder.status !== 'waiting approval')
        throw new HttpException(400, 'Order cannot be accepted right now');
      const selectedWarehouse = await prisma.warehouse.findFirst({
        where: {
          id: findOrder.warehouse_id,
        },
      });
      const orderDetails = findOrder?.cart?.CartItem;
      if (
        !findOrder.cart ||
        !findOrder.cart.CartItem ||
        findOrder.cart.CartItem.length === 0
      )
        throw new HttpException(
          400,
          'Cart is not valid, cannot be used for transaction right now...',
        );

      await prisma.$transaction(async () => {
        try {
          // cek dulu stocknya di selected warehouse, kalo kurang lakuin mutasi stok dari warehouse lain ke selected warehouse (+jurnal plus minus)
          await this.mutationService.verifyStock(
            orderDetails,
            selectedWarehouse,
          );
          // update statusnya ke 'ready
          await this.updateTransactionStatus(transactionId, 'ready');
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  };

  public sendTransactionOrder = async (transactionId: number) => {
    // setelah quantity barang cukup di Selected Warehouse, kurangin stocknya sbg pembelian dan catat (+jurnal minus)
    try {
      const findOrder = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
        },
        include: {
          cart: {
            include: {
              CartItem: true,
            },
          },
          warehouse: true,
        },
      });
      if (findOrder.status !== 'ready')
        throw new HttpException(400, 'Order cannot be send right now...');

      const orderDetails = findOrder?.cart?.CartItem;
      if (
        !findOrder.cart ||
        !findOrder.cart.CartItem ||
        findOrder.cart.CartItem.length === 0
      )
        throw new HttpException(
          400,
          'Cart is not valid, cannot be used for transaction right now...',
        );
      const selectedWarehouse = findOrder?.warehouse;
      if (!selectedWarehouse)
        throw new HttpException(
          400,
          'Warehouse is not valid, cannot be used for transaction right now...',
        );

      const transaction = await prisma.$transaction(async () => {
        try {
          const order = await this.mutationService.orderStock(
            findOrder.id,
            orderDetails,
            selectedWarehouse,
          );
          await this.updateTransactionStatus(transactionId, 'on delivery');
          // disini
          return order;
        } catch (error) {
          throw error;
        }
      });
      return transaction;
    } catch (error) {
      throw error;
    }
  };

  public cancelTransactionOrder = async (transactionId: number) => {
    try {
      const checkOrder = await prisma.transaction.findFirst({
        where: { id: transactionId },
        include: {
          cart: {
            include: {
              CartItem: true,
            },
          },
        },
      });
      if (!checkOrder) throw new HttpException(400, 'Order does not exist');
      if (checkOrder.status !== 'ready')
        throw new HttpException(400, 'Order cannot be canceled right now');
      const orderItemList = checkOrder.cart.CartItem || [];
      if (orderItemList.length < 1)
        throw new HttpException(400, 'Order item does not exist');

      // //balikin qty item yg ada di Cart Item ke warehouse yg tercantum di transaction + tambahin jurnal pemasukan (PLUS)
      // await this.stockQuery.returnStockAfterCanceledQuery(
      //   checkOrder.id,
      //   orderItemList,
      //   checkOrder.warehouse_id,
      // );
      //ubah transaction status ke canceled
      // return await this.returnStockCancelledOrder(transactionId);
      await this.updateTransactionStatus(transactionId, 'cancelled');
    } catch (error) {
      throw error;
    }
  };

  public returnStockCancelledOrder = async (transactionId: number) => {
    try {
      const listMutation = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
        },
        include: {
          warehouse: {
            include: {
              WarehouseStock: {
                include: {
                  JurnalStock: true,
                },
              },
            },
          },
        },
      });
      return listMutation;
    } catch (error) {
      throw error;
    }
  };

  public getAdminTransactions = async (
    userId: number,
    role: string,
    searchDate: string,
  ) => {
    try {
      if (role === 'super admin') {
        if (searchDate === '') {
          return await prisma.transaction.findMany({
            orderBy: {
              created_at: 'desc',
            },
          });
        } else {
          const startDate = new Date(searchDate);
          const endDate = new Date(
            new Date(searchDate).setDate(new Date(searchDate).getDate() + 1),
          );

          // Set from UTC + 7 to UTC + 0
          startDate.setHours(startDate.getHours() - 7);
          endDate.setHours(endDate.getHours() - 7);
          return await prisma.transaction.findMany({
            where: {
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          });
        }
      } else {
        const warehouse = await prisma.warehouse.findUnique({
          where: { warehouse_admin_id: userId },
        });
        console.log(
          '🚀 ~ TransactionService ~ getAdminTransactions= ~ warehouse:',
          warehouse.id,
        );

        if (!warehouse) {
          throw new Error('No warehouse assigned to this admin.');
        }

        if (searchDate === '') {
          return await prisma.transaction.findMany({
            where: { warehouse_id: warehouse.id },
            orderBy: {
              created_at: 'desc',
            },
          });
        } else {
          const startDate = new Date(searchDate);
          const endDate = new Date(
            new Date(searchDate).setDate(new Date(searchDate).getDate() + 1),
          );

          // Set from UTC + 7 to UTC + 0
          startDate.setHours(startDate.getHours() - 7);
          endDate.setHours(endDate.getHours() - 7);
          return await prisma.transaction.findMany({
            where: {
              warehouse_id: warehouse.id,
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            },
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };
}
