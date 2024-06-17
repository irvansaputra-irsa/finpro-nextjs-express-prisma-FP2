import { StockController } from '@/controllers/stock.controller';
import { Router } from 'express';

export class StockRouter {
  private router: Router;
  private stockController: StockController;

  constructor() {
    this.stockController = new StockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // add product ke warehouse
    this.router.post(
      '/',
      this.stockController.addProductToWarehouseStockController,
    );
    // nambah stock dari product yg udah ada di warehouse
    this.router.patch('/', this.stockController.addStockController);
    // get list product yang sudah ditambahkan ke warehouse
    this.router.get(
      '/:id',
      this.stockController.fetchAllProductAtSelectedWarehouseController,
    );
    //get list product YANG BELUM PERNAH ditambahkan ke warehouse tsb
    this.router.get(
      '/new/:id',
      this.stockController.fetchProductNotAddedYetController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
