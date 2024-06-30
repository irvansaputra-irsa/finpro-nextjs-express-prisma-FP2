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
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status },
      });
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

      const transactionPrisma = await prisma.$transaction(async () => {
        try {
          // cek dulu stocknya di selected warehouse, kalo kurang lakuin mutasi stok dari warehouse lain ke selected warehouse (+jurnal plus minus)
          await this.mutationService.verifyStock(
            orderDetails,
            selectedWarehouse,
          );
          // baru kurangin stock di selected warehouse sbg pembelian dan (+jurnal minus)
          const order = await this.mutationService.orderStock(
            findOrder.id,
            orderDetails,
            selectedWarehouse,
          );
          // update statusnya ke 'ready
          await this.updateTransactionStatus(transactionId, 'ready');
          return order;
        } catch (error) {
          throw error;
        }
      });
      return transactionPrisma;
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
      if (checkOrder.status !== 'waiting approval')
        throw new HttpException(400, 'Order cannot be canceled right now');
      const orderItemList = checkOrder.cart.CartItem || [];
      if (orderItemList.length < 1)
        throw new HttpException(400, 'Order item does not exist');

      //balikin qty item yg ada di Cart Item ke warehouse yg tercantum di transaction + tambahin jurnal pemasukan (PLUS)
      await this.stockQuery.returnStockAfterCanceledQuery(
        checkOrder.id,
        orderItemList,
        checkOrder.warehouse_id,
      );
      //ubah transaction status ke canceled
    } catch (error) {
      throw error;
    }
  };

  public getAdminTransactions = async (userId: number, role: string) => {
    try {
      if (role === 'super admin') {
        return await prisma.transaction.findMany({
          orderBy: {
            created_at: 'desc',
          },
        });
      } else {
        const warehouse = await prisma.warehouse.findUnique({
          where: { warehouse_admin_id: userId },
        });

        if (!warehouse) {
          throw new Error('No warehouse assigned to this admin.');
        }

        return await prisma.transaction.findMany({
          where: { warehouse_id: warehouse.id },
          orderBy: {
            created_at: 'desc',
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };
}
