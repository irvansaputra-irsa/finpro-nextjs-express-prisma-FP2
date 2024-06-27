import { Service } from 'typedi';
import { TransactionQuery } from '@/queries/transaction.queries';
import { CreateTransaction } from '@/interfaces/transaction.interfaces';
import prisma from '@/prisma';
import { Transaction } from '@prisma/client';

@Service()
export class TransactionService {
  constructor(private readonly transactionQuery: TransactionQuery) {}

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
