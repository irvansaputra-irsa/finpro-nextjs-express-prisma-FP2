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
    this.router.get(
      '/',
      this.productCategoryController.getProductCategoriesController,
    );
    this.router.patch(
      '/',
      this.productCategoryController.updateProductCategoryController,
    );
    this.router.delete(
      '/:id',
      this.productCategoryController.deleteProductCategoryController,
    );
    this.router.get(
      '/:id',
      this.productCategoryController.getProductCategoryController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
