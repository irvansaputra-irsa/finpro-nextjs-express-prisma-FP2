import { Router } from 'express';
import { Container } from 'typedi';
import { TransactionController } from '@/controllers/transaction.controller';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = Container.get(TransactionController);
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/', this.transactionController.createTransaction);
    this.router.post('/fetch', this.transactionController.getUserTransactions);
    this.router.post('/confirm', this.transactionController.confirmOrder);
    this.router.post(
      '/update-status',
      this.transactionController.updateTransactionStatus,
    );
    this.router.post('/admin', this.transactionController.getAdminTransactions);
    this.router.post(
      '/accept',
      this.transactionController.acceptTransactionOrder,
    );
    this.router.post(
      '/cancel',
      this.transactionController.cancelTransactionOrder,
    );
    this.router.post('/send', this.transactionController.sendTransactionOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
