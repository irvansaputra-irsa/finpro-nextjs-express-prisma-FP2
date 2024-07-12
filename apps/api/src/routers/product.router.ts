import { ProductController } from '@/controllers/product.controller';
import { uploader } from '@/helpers/multer';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ProductMiddleware } from '@/middlewares/product.middleware';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;
  private productMiddleware: ProductMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.productController = new ProductController();
    this.productMiddleware = new ProductMiddleware();
    this.authMiddleware = new AuthMiddleware();

    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.productMiddleware.isProductNameExist,
      uploader('IMG', '/products').array('files', 5),
      this.productController.createProductController,
    );
    this.router.get(
      '/lists',
      this.productController.getListProductNameController,
    );
    this.router.get(
      '/dashboard',
      this.productController.getAllProductsDashboardController,
    );
    this.router.delete(
      '/:id',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.productController.deleteProductController,
    );
    this.router.get('/', this.productController.getAllProductsController);
    this.router.get('/:bookName', this.productController.getProductController);
    this.router.patch(
      '/',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.productMiddleware.isProductNameExistUpdate,
      uploader('IMG', '/products').array('files', 5),
      this.productController.updateProductController,
    );
    this.router.delete(
      '/image/:id',
      this.authMiddleware.verifyToken,
      this.authMiddleware.adminGuard,
      this.productController.deleteProductImageController,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
