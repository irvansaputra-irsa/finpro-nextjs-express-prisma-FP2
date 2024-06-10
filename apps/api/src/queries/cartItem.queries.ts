import { Service } from 'typedi';
import { CartItem } from '@prisma/client';
import { checkCartItem } from '@/interfaces/checkCartItem.interfaces';
import { createCartItem } from '@/interfaces/createCartItem.interfaces';
import { addCartItem } from '@/interfaces/addCart.interfaces';
import { updateCartItem } from '@/interfaces/updateCartItem.interfaces';
import { allCartItem } from '@/interfaces/allCartItem.interfaces';
import prisma from '@/prisma';

@Service()
export class CartItemQuery {
  public checkCartItemExistQuery = async (
    param: checkCartItem,
  ): Promise<number> => {
    try {
      const { cartId, bookId } = param;
      const data = await prisma.cartItem.findFirst({
        where: {
          book_id: bookId,
          cart_id: cartId,
        },
      });

      if (data === null) {
        return null;
      }

      return data.id;
    } catch (error) {
      throw error;
    }
  };

  public createNewCartItemQuery = async (
    param: createCartItem,
  ): Promise<number> => {
    try {
      const { cartId, bookId } = param;
      const data = await prisma.cartItem.create({
        data: {
          cart_id: cartId,
          book_id: bookId,
          quantity: 0,
          total_price: 0,
          total_weight: 0,
        },
      });

      return data.id;
    } catch (error) {
      throw error;
    }
  };

  public addCartItemQuery = async (param: addCartItem): Promise<void> => {
    try {
      const { cartItemId, quantity } = param;

      const cartItemData = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
        },
      });

      const bookData = await prisma.book.findFirst({
        where: {
          id: cartItemData.book_id,
        },
      });

      const newQuantity = quantity;

      const newPrice = newQuantity * bookData.book_price;

      const newWeight = newQuantity * bookData.book_weight;

      const updateResult = await prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity: newQuantity,
          total_price: newPrice,
          total_weight: newWeight,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  public updateCartItemQuery = async (param: updateCartItem): Promise<void> => {
    try {
      const { cartItemId, quantity } = param;

      const newQuantity = quantity;

      // quantity bernilai negatif dihandle pada frontend
      if (newQuantity === 0) {
        await prisma.cartItem.delete({
          where: {
            id: cartItemId,
          },
        });
      } else {
        const cartItemData = await prisma.cartItem.findFirst({
          where: {
            id: cartItemId,
          },
        });

        const bookData = await prisma.book.findFirst({
          where: {
            id: cartItemData.book_id,
          },
        });

        const newPrice = newQuantity * bookData.book_price;

        const newWeight = newQuantity * bookData.book_weight;

        const updateResult = await prisma.cartItem.update({
          where: {
            id: cartItemId,
          },
          data: {
            quantity: newQuantity,
            total_price: newPrice,
            total_weight: newWeight,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  public allCartItemQuery = async (param: allCartItem): Promise<CartItem[]> => {
    try {
      const { cartId } = param;

      const data = await prisma.cartItem.findMany({
        where: {
          cart_id: cartId,
        },
        orderBy: [
          {
            id: 'asc',
          },
        ],
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
