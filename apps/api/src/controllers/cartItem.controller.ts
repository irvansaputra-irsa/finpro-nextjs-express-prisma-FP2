import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { CartItem } from '@prisma/client';
import { CartItemService } from '@/services/cartItem.services';
import { BookService } from '@/services/book.services';

export class CartItemController {
  cartItemController = Container.get(CartItemService);
  bookController = Container.get(BookService);

  public allController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { cartId } = req.body;
      const returnResult = [];
      const cartItems: CartItem[] =
        await this.cartItemController.allCartItemService({
          cartId,
        });

      for (let i = 0; i < cartItems.length; i++) {
        const bookId: number = cartItems[i].book_id;
        const bookName = await this.bookController.getNameService({ bookId });
        returnResult.push({
          name: bookName,
          quantity: cartItems[i].quantity,
          totalPrice: cartItems[i].total_price,
          totalWeight: cartItems[i].total_weight,
        });
      }

      res.status(200).json({ returnResult });
    } catch (error) {
      next(error);
    }
  };
}
