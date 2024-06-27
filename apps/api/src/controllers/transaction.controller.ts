import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { TransactionService } from '@/services/transaction.services';
import { TransactionQuery } from '@/queries/transaction.queries';

@Service()
export class TransactionController {
  private transactionQuery: TransactionQuery;

  constructor(private readonly transactionService: TransactionService) {
    this.transactionQuery = new TransactionQuery();
  }

  public getUserTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = parseInt(req.body.userId as string, 10);
      const searchDate = req.body.searchDate as string;

      if (isNaN(userId)) {
        throw new Error('Invalid userId');
      }

      const transactions = await this.transactionQuery.getUserTransactions({
        userId,
        searchDate,
      });
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  public createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      //   res.status(201).json({ message: 'Creating transaction...' });
      const transactionData = req.body;
      const transaction =
        await this.transactionService.createTransactionService(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };

  public confirmOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { transactionId } = req.body;
      await this.transactionService.confirmOrder(transactionId);
      res.status(200).json({ message: 'Order confirmed successfully' });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
}
