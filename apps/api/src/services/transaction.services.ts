import Container, { Service } from 'typedi';
import { TransactionQuery } from '@/queries/transaction.queries';
import { CreateTransaction } from '@/interfaces/transaction.interfaces';
import prisma from '@/prisma';
import { Transaction } from '@prisma/client';
import { HttpException } from '@/exceptions/http.exception';
import { MutationService } from './mutation.service';

@Service()
export class TransactionService {
  constructor(private readonly transactionQuery: TransactionQuery) {}
  mutationService = Container.get(MutationService);
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
          //cek dulu stocknya di selected warehouse, kalo kurang lakuin mutasi stok dari warehouse lain ke selected warehouse (+jurnal plus minus)
          await this.mutationService.verifyStock(
            orderDetails,
            selectedWarehouse,
          );
          //baru kurangin stock di selected warehouse sbg pembelian dan (+jurnal minus)
          const order = await this.mutationService.orderStock(
            findOrder.id,
            orderDetails,
            selectedWarehouse,
          );
          //update statusnya ke 'ready
          await this.updateTransactionStatus(transactionId, 'ready');
          return order;
        } catch (error) {
          throw error;
        }
        return transactionPrisma;
      });
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
