import prisma from '@/prisma';
import { Service } from 'typedi';
import { Transaction } from '@prisma/client';

interface CreateTransaction {
  status: string;
  payment_method: string;
  payment_proof: string;
  confirmation_date: Date;
  final_price: number;
  destination_id: number;
  warehouse_id: number;
  cart_id: number;
}

interface GetTransactionsParams {
  userId: number;
  searchDate?: string; // search optional
}

@Service()
export class TransactionQuery {
  public createTransaction = async (
    param: CreateTransaction,
  ): Promise<Transaction> => {
    try {
      const {
        status,
        payment_method,
        payment_proof,
        confirmation_date,
        final_price,
        destination_id,
        warehouse_id,
        cart_id,
      } = param;

      const data = await prisma.transaction.create({
        data: {
          status,
          payment_method,
          payment_proof,
          confirmation_date,
          final_price,
          destination_id,
          warehouse_id,
          cart_id,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getUserTransactions = async (params: GetTransactionsParams) => {
    const { userId, searchDate } = params;

    const carts = await prisma.cart.findMany({
      where: { user_id: userId },
      select: { id: true },
    });

    const cartIds = carts.map((cart) => cart.id);

    const whereClause: any = {
      cart_id: { in: cartIds },
    };

    if (searchDate) {
      whereClause.created_at = {
        gte: new Date(searchDate),
        lt: new Date(
          new Date(searchDate).setDate(new Date(searchDate).getDate() + 1),
        ),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
    });

    return transactions;
  };
}
