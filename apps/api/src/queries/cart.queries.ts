import prisma from '@/prisma';
import { Service } from 'typedi';
import { Cart, Transaction, User } from '@prisma/client';
import { getAliveCart } from '@/interfaces/getAliveCart.interfaces';

@Service()
export class CartQuery {
  public getAliveCartQuery = async (param: getAliveCart): Promise<Cart> => {
    try {
      const { userId } = param;
      const data = await prisma.cart.findFirst({
        where: {
          user_id: userId,
          id: {
            notIn: await prisma.transaction
              .findMany({
                select: { cart_id: true },
              })
              .then((transactions) =>
                transactions.map((transaction) => transaction.cart_id),
              ),
          },
        },
        include: {
          CartItem: true,
        },
      });

      if (data === null) {
        const newData = await prisma.cart.create({
          data: {
            user_id: userId,
          },
        });

        return newData;
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  public async checkStock(cartId: number) {
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: cartId },
      include: { book: true },
    });

    for (const item of cartItems) {
      const bookStock = await prisma.warehouseStock.findMany({
        where: { book_id: item.book_id },
      });

      const totalStock = bookStock.reduce(
        (acc, stock) => acc + stock.stockQty,
        0,
      );

      if (totalStock < item.quantity) {
        throw new Error(`Insufficient stock for book ID ${item.book_id}`);
      }
    }

    return true;
  }
}
