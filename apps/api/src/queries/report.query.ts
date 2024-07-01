import prisma from '@/prisma';
import { Service } from 'typedi';

@Service()
export class ReportQuery {
  public sumSalesRevenuePerMonth = async (
    byCategory: string,
    byProduct: string,
  ) => {
    try {
      const filterCategory = {
        book: {
          bookCategory: {
            book_category_name: byCategory,
          },
        },
      };

      const filterProduct = {
        book: {
          book_name: byProduct,
        },
      };

      const dateBetween = {
        january: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-01-31'),
        },
        february: {
          gte: new Date('2024-02-01'),
          lte: new Date('2024-02-29'),
        },
        march: {
          gte: new Date('2024-03-01'),
          lte: new Date('2024-03-31'),
        },
        april: { gte: new Date('2024-04-01'), lte: new Date('2024-04-30') },
        may: { gte: new Date('2024-05-01'), lte: new Date('2024-05-31') },
        june: {
          gte: new Date('2024-06-01'),
          lte: new Date('2024-06-30'),
        },
      };

      const sumRevenueByMonth = async (month: string) => {
        const cartItemMonthSales = await prisma.cartItem.aggregate({
          _sum: {
            total_price: true,
          },
          where: {
            AND: [
              {
                cart: {
                  Transaction: {
                    created_at: dateBetween[month],
                  },
                },
              },
              {
                OR: [
                  {
                    cart: {
                      Transaction: {
                        status: 'ready',
                      },
                    },
                  },
                  {
                    cart: {
                      Transaction: {
                        status: 'completed',
                      },
                    },
                  },
                ],
              },
              byCategory ? filterCategory : {},
              byProduct ? filterProduct : {},
            ],
          },
        });
        return cartItemMonthSales;
      };

      const [
        janRevenue,
        febRevenue,
        marchRevenue,
        aprilRevenue,
        mayRevenue,
        juneRevenue,
      ] = await Promise.all([
        sumRevenueByMonth('january'),
        sumRevenueByMonth('february'),
        sumRevenueByMonth('march'),
        sumRevenueByMonth('april'),
        sumRevenueByMonth('may'),
        sumRevenueByMonth('june'),
      ]);

      return {
        janRevenue: janRevenue._sum.total_price ?? 0,
        febRevenue: febRevenue._sum.total_price ?? 0,
        marchRevenue: marchRevenue._sum.total_price ?? 0,
        aprilRevenue: aprilRevenue._sum.total_price ?? 0,
        mayRevenue: mayRevenue._sum.total_price ?? 0,
        juneRevenue: juneRevenue._sum.total_price ?? 0,
      };
    } catch (error) {
      throw error;
    }
  };

  public topSellingProduct = async () => {
    try {
      const topSalesProduct =
        await prisma.$queryRaw`SELECT b.*, SUM(c.quantity) AS Sold FROM cartItem c JOIN  book b on c.book_id = b.id JOIN cart ca on ca.id = c.cart_id JOIN transaction t on t.cart_id = ca.id WHERE t.status = 'ready' OR t.status = 'completed' OR t.status = 'on delivery' GROUP BY c.book_id ORDER BY Sold DESC;`;
      return topSalesProduct;
    } catch (error) {
      throw error;
    }
  };
}
