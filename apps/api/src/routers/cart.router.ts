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
    this.router.get('/get-cart-id/:userId', this.cartController.getCartId);
    this.router.post('/add-item', this.cartController.addItemController);
    this.router.post('/update-item', this.cartController.updateItemController);
    this.router.post('/check-stock', this.cartController.checkStock);
  }

  getRouter(): Router {
    return this.router;
  }
}
