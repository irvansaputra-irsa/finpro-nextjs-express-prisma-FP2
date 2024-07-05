import prisma from '@/prisma';
import { User } from '@/types/express';
import { Service } from 'typedi';

@Service()
export class ReportQuery {
  public sumSalesRevenuePerMonth = async (
    byCategory: string | null,
    byProduct: string | null,
    byWarehouse: number | null,
    user: User,
  ) => {
    try {
      const filterCategory = {
        //filter by category
        book: {
          bookCategory: {
            book_category_name: byCategory,
          },
        },
      };
      const filterProduct = {
        //filter by product
        book: {
          book_name: byProduct,
        },
      };
      //authorization checking and filter by warehouse
      const roles = user?.role;
      let queryWarehouseId: number = 0;
      if (roles === 'super admin') {
        if (byWarehouse) {
          queryWarehouseId = byWarehouse;
        }
      } else {
        const findWarehouse = await prisma.warehouse.findFirst({
          where: {
            warehouse_admin_id: user?.id,
          },
        });
        queryWarehouseId = findWarehouse.id;
      }

      const dateBetween = {
        january: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-01-31'),
        },
        february: {
          gte: new Date('2024-02-01'),
          lte: new Date('2024-02-11'),
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
            quantity: true,
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
                  {
                    cart: {
                      Transaction: {
                        status: 'on delivery',
                      },
                    },
                  },
                ],
              },
              byCategory ? filterCategory : {},
              byProduct ? filterProduct : {},
              queryWarehouseId
                ? { cart: { Transaction: { warehouse_id: queryWarehouseId } } }
                : {},
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
        janRevenue: {
          revenue: janRevenue._sum.total_price ?? 0,
          sold: janRevenue._sum.quantity ?? 0,
        },
        febRevenue: {
          revenue: febRevenue._sum.total_price ?? 0,
          sold: febRevenue._sum.quantity ?? 0,
        },
        marchRevenue: {
          revenue: marchRevenue._sum.total_price ?? 0,
          sold: marchRevenue._sum.quantity ?? 0,
        },
        aprilRevenue: {
          revenue: aprilRevenue._sum.total_price ?? 0,
          sold: aprilRevenue._sum.quantity ?? 0,
        },
        mayRevenue: {
          revenue: mayRevenue._sum.total_price ?? 0,
          sold: mayRevenue._sum.quantity ?? 0,
        },
        juneRevenue: {
          revenue: juneRevenue._sum.total_price ?? 0,
          sold: juneRevenue._sum.quantity ?? 0,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  public topSellingProduct = async () => {
    try {
      const topSalesProduct =
        await prisma.$queryRaw`SELECT b.*, SUM(c.quantity) AS sold FROM cartItem c JOIN  book b on c.book_id = b.id JOIN cart ca on ca.id = c.cart_id JOIN transaction t on t.cart_id = ca.id WHERE t.status = 'ready' OR t.status = 'completed' OR t.status = 'on delivery' GROUP BY c.book_id ORDER BY Sold DESC LIMIT 5;`;
      return topSalesProduct;
    } catch (error) {
      throw error;
    }
  };

  public getTransactionReportList = async () => {
    try {
      const lists = await prisma.transaction.findMany({
        select: {
          id: true,
          status: true,
          payment_method: true,
          final_price: true,
          warehouse: {
            select: {
              id: true,
              warehouse_name: true,
            },
          },
        },
      });
      return lists;
    } catch (error) {}
  };
}
