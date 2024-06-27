import { WarehouseController } from '@/controllers/warehouse.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class WarehouseRouter {
  private router: Router;
  private warehouseController: WarehouseController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.warehouseController = new WarehouseController();
    this.authMiddleware = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.warehouseController.getAllWarehouseController,
    );
    this.router.get(
      '/admin/:id',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.warehouseController.findWarehouseByUserController,
    );
    this.router.get(
      '/list',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.warehouseController.getListWarehouseController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
