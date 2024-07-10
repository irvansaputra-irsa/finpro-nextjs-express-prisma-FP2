import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import Container from 'typedi';
import { CartService } from '@/services/cart.services';
import { CartItemService } from '@/services/cartItem.services';
import { addItemRequest } from '@/interfaces/addItemRequest.interfaces';
import { updateCartItem } from '@/interfaces/updateCartItem.interfaces';

export class CartController {
  cartController = Container.get(CartService);
  cartItemController = Container.get(CartItemService);

  public getCartId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const cartId = await this.cartController.getAliveCartService({
        userId: Number(userId),
      });

      res.status(200).json({ cartId });
    } catch (error) {
      next(error);
    }
  };

  // untuk menambahkan buku baru ke dalam cart
  // sehingga, sekaligus menambah cartitem ke dalam cart
  public addItemController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, bookId, quantity } = req.body as addItemRequest;
      const cart = await this.cartController.getAliveCartService({ userId });

      let cartItemId = await this.cartItemController.checkCartItemExistService({
        cartId: cart.id,
        bookId,
      });

      if (cartItemId === null) {
        cartItemId = await this.cartItemController.createNewCartItemService({
          cartId: cart.id,
          bookId,
        });
      }

      let addBookToCartItem = await this.cartItemController.addCartItemService({
        cartItemId,
        quantity,
      });

      res.status(201).json({
        message: 'Successfully added book to user cart',
        cartId: cart.id,
      });
    } catch (error) {
      next(error);
    }
  };

  // untuk memperbaharui buku dalam cart
  // sehingga, bisa menghilangkan cartitem dari dalam cart -> syarat: quantity 0
  public updateItemController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { cartItemId, quantity } = req.body as updateCartItem;

      let addBookToCartItem =
        await this.cartItemController.updateCartItemService({
          cartItemId,
          quantity,
        });

      res.status(201).json({
        message: 'Successfully update book to user cart',
      });
    } catch (error) {
      next(error);
    }
  };

  public checkStock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { cartId } = req.body;
      const isStockSufficient = await this.cartController.checkStock(cartId);
      res.status(200).json({ isStockSufficient });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
      next(error);
    }
  };
}
