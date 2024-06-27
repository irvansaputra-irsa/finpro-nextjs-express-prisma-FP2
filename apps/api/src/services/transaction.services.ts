import { Service } from 'typedi';
import { TransactionQuery } from '@/queries/Transaction.queries';
import { CreateTransaction } from '@/interfaces/Transaction.interfaces';
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
}
