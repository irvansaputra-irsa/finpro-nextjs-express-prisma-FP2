import { Router } from 'express';
import { CartItemController } from '@/controllers/cartItem.controller';

export class CartItemRouter {
  private router: Router;
  private cartItemController: CartItemController;

  constructor() {
    this.cartItemController = new CartItemController();
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/all', this.cartItemController.allController);
  }

  getRouter(): Router {
    return this.router;
  }
}
