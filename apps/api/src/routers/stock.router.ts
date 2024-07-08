import { StockController } from '@/controllers/stock.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class StockRouter {
  private router: Router;
  private stockController: StockController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.stockController = new StockController();
    this.authMiddleware = new AuthMiddleware();

    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // add product ke warehouse
    this.router.post(
      '/',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.stockController.addProductToWarehouseStockController,
    );
    // nambah stock dari product yg udah ada di warehouse
    this.router.patch(
      '/',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.stockController.addStockController,
    );
    //ngurangin stock dr product yg udah ada di warehouse
    this.router.patch(
      '/remove',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.stockController.removeStockController,
    );
    // get list product yang sudah ditambahkan ke warehouse
    this.router.get(
      '/:id',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.stockController.fetchAllProductAtSelectedWarehouseController,
    );
    //get list product YANG BELUM PERNAH ditambahkan ke warehouse tsb
    this.router.get(
      '/new/:id',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.stockController.fetchProductNotAddedYetController,
    );
    //delete warehouse product
    this.router.delete(
      '/:id',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.stockController.deleteProductStockController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
