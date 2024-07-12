import prisma from '@/prisma';
import { Service } from 'typedi';
import { Transaction } from '@prisma/client';

interface CreateTransaction {
  status: string;
  payment_method: string;
  payment_proof: string;
  confirmation_date: Date;
  final_price: number;
  destination_id: number;
  warehouse_id: number;
  cart_id: number;
}

interface GetTransactionsParams {
  userId: number;
  searchDate?: string; // search optional
}

@Service()
export class TransactionQuery {
  public createTransaction = async (
    param: CreateTransaction,
  ): Promise<Transaction> => {
    try {
      const {
        status,
        payment_method,
        payment_proof,
        confirmation_date,
        final_price,
        destination_id,
        warehouse_id,
        cart_id,
      } = param;

      const data = await prisma.transaction.create({
        data: {
          status,
          payment_method,
          payment_proof,
          confirmation_date,
          final_price,
          destination_id,
          warehouse_id,
          cart_id,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  public cronUpdateStatus = async () => {
    //get time from device
    const currentTime = new Date();
    const timeTreshold = new Date(currentTime.getTime() - 2 * 60 * 1000);
    /**
     * convert timeTreshold from UTC+n to UTC+0
     * karena di frontend, kita dapatnya dari timezone device client
     * getTimezoneOffset kalau return -60 berarti UTC+01
     * getTimezoneOffset kalau return -600 berarti UTC+10
     */
    // const offset = timeTreshold.getTimezoneOffset();
    // console.log(offset);
    // console.log(`time treshold before: `, timeTreshold);
    // var hourDiff = offset / 60;
    // timeTreshold.setHours(timeTreshold.getHours() + hourDiff);
    console.log(timeTreshold);

    try {
      const updateOrders = await prisma.transaction.updateMany({
        where: {
          confirmation_date: {
            lt: timeTreshold,
          },
          status: 'on delivery',
        },
        data: {
          status: 'completed',
        },
      });

      console.log(
        `Successfully updated ${updateOrders.count} records with cron`,
      );
    } catch (error) {
      console.error('encounter error while updating order status');
    }
  };

  public getUserTransactions = async (params: GetTransactionsParams) => {
    const { userId, searchDate } = params;
    console.log('search date', searchDate);

    const carts = await prisma.cart.findMany({
      where: { user_id: userId },
      select: { id: true },
    });

    const cartIds = carts.map((cart) => cart.id);

    const whereClause: any = {
      cart_id: { in: cartIds },
    };

    if (searchDate) {
      const startDate = new Date(searchDate);
      const endDate = new Date(
        new Date(searchDate).setDate(new Date(searchDate).getDate() + 1),
      );

      // Set from UTC + 7 to UTC + 0
      startDate.setHours(startDate.getHours() - 7);
      endDate.setHours(endDate.getHours() - 7);
      whereClause.created_at = {
        gte: startDate,
        lt: endDate,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
    });

    return transactions;
  };
}
