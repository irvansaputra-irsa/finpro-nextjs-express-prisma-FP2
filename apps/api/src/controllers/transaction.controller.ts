import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { TransactionService } from '@/services/transaction.services';

@Service()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

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
}
