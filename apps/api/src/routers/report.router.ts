import { ReportController } from '@/controllers/report.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';
import Container from 'typedi';

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;
  private authMiddleware: AuthMiddleware;
  constructor() {
    this.reportController = new ReportController();
    this.authMiddleware = new AuthMiddleware();

    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.get(
      '/revenue',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.reportController.sumSalesRevenuePerMonth,
    );
    this.router.get(
      '/top-selling',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.reportController.topSellingProduct,
    );
    this.router.get(
      '/sales-list',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.reportController.getTransactionReportList,
    );
    this.router.get(
      '/stock-overview',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.reportController.getOverviewStockReport,
    );
    this.router.get(
      '/stock-list',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.reportController.getStockReportList,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
