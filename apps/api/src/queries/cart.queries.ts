import prisma from '@/prisma';
import { Service } from 'typedi';
import { Cart, Transaction, User } from '@prisma/client';
import { getAliveCart } from '@/interfaces/getAliveCart.interfaces';

@Service()
export class CartQuery {
  public getAliveCartQuery = async (param: getAliveCart): Promise<number> => {
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
      });

      if (data === null) {
        const newData = await prisma.cart.create({
          data: {
            user_id: userId,
          },
        });

        return newData.id;
      }

      return data.id;
    } catch (error) {
      throw error;
    }
  };
}
