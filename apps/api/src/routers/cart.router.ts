import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/add-item', this.cartController.addItemController);
    this.router.post('/update-item', this.cartController.updateItemController);
  }

  getRouter(): Router {
    return this.router;
  }
}
