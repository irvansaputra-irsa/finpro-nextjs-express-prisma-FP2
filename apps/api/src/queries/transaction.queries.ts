import prisma from '@/prisma';
import { Service } from 'typedi';
import { Transaction } from '@prisma/client';
import { CreateTransaction } from '@/interfaces/Transaction.interfaces';

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
}
