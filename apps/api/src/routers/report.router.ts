import { ReportController } from '@/controllers/report.controller';
import { Router } from 'express';
import Container from 'typedi';

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;
  constructor() {
    this.reportController = new ReportController();
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/revenue', this.reportController.sumSalesRevenuePerMonth);
    this.router.post('/top-selling', this.reportController.topSellingProduct);
  }

  getRouter(): Router {
    return this.router;
  }
}
