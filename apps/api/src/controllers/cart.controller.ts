import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import Container from 'typedi';
import { CartService } from '@/services/cart.services';
import { CartItemService } from '@/services/cartItem.services';
import { addItemRequest } from '@/interfaces/addItemRequest.interfaces';

export class CartController {
  cartController = Container.get(CartService);
  cartItemController = Container.get(CartItemService);

  // untuk menambahkan buku baru ke dalam cart
  // sehingga, sekaligus menambah cartitem ke dalam cart
  public addItemController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, bookId, quantity } = req.body as addItemRequest;
      const cartId = await this.cartController.getAliveCartService({ userId });

      let cartItemId = await this.cartItemController.checkCartItemExistService({
        cartId,
        bookId,
      });

      if (cartItemId === null) {
        cartItemId = await this.cartItemController.createNewCartItemService({
          cartId,
          bookId,
        });
      }

      let addBookToCartItem = await this.cartItemController.addCartItemService({
        cartItemId,
        quantity,
      });

      res.status(201).json({
        message: 'Successfully added book to user cart',
      });
    } catch (error) {
      throw error;
    }
  };
}
