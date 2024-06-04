import { ProductCategoryController } from '@/controllers/productCategory.controller';
import { Router } from 'express';

export class ProductCategoryRouter {
  private router: Router;
  private productCategoryController: ProductCategoryController;

  constructor() {
    this.productCategoryController = new ProductCategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.productCategoryController.createProductCategoryController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
