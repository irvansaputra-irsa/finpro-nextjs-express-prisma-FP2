import prisma from '@/prisma';
import { User } from '@/types/express';
import { deleteHypeninString } from '@/utils/convert.utils';
import { dateBetween } from '@/utils/rangeDate.utils';
import { Service } from 'typedi';

@Service()
export class ReportQuery {
  public sumSalesRevenuePerMonth = async (
    byCategory: string | null,
    byProduct: string | null,
    byWarehouse: string | null,
    user: User,
  ) => {
    try {
      const filterCategory = {
        //filter by category
        book: {
          bookCategory: {
            book_category_name: deleteHypeninString(byCategory),
          },
        },
      };
      const filterProduct = {
        //filter by product
        book: {
          book_name: deleteHypeninString(byProduct),
        },
      };
      //authorization checking and filter by warehouse
      const roles = user?.role;
      let queryWarehouseId: number = 0;
      if (roles === 'super admin') {
        if (byWarehouse) {
          const warehouse = await prisma.warehouse.findFirstOrThrow({
            where: {
              warehouse_name: deleteHypeninString(byWarehouse),
            },
          });
          queryWarehouseId = warehouse.id;
        }
      } else {
        const findWarehouse = await prisma.warehouse.findFirst({
          where: {
            warehouse_admin_id: user?.id,
          },
        });
        queryWarehouseId = findWarehouse.id;
      }

      const date = dateBetween;
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
                    created_at: date[month],
                  },
                },
              },
              {
                OR: [
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
        julyRevenue,
      ] = await Promise.all([
        sumRevenueByMonth('january'),
        sumRevenueByMonth('february'),
        sumRevenueByMonth('march'),
        sumRevenueByMonth('april'),
        sumRevenueByMonth('may'),
        sumRevenueByMonth('june'),
        sumRevenueByMonth('july'),
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
        julyRevenue: {
          revenue: julyRevenue._sum.total_price ?? 0,
          sold: julyRevenue._sum.quantity ?? 0,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  public topSellingProduct = async (
    user: User,
    queryWarehouse: string | null,
    queryMonth: string | null,
  ) => {
    try {
      let filter = '';
      if (user.role === 'super admin') {
        if (queryWarehouse) {
          const warehouse = await prisma.warehouse.findFirstOrThrow({
            where: {
              warehouse_name: deleteHypeninString(queryWarehouse),
            },
          });
          const warehouseId = warehouse.id;
          filter += `AND t.warehouse_id = ${warehouseId}`;
        }
      } else {
        const warehouseAdmin = await prisma.warehouse.findFirstOrThrow({
          where: {
            warehouse_admin_id: user?.id,
          },
        });
        const warehouseId = warehouseAdmin.id;
        filter += `AND t.warehouse_id = ${warehouseId}`;
      }
      if (queryMonth) {
        filter += `AND monthname(t.created_at)='${queryMonth}'`;
      }

      const topSalesProduct = await prisma.$queryRawUnsafe(
        `SELECT b.*, SUM(c.quantity) AS sold FROM CartItem c JOIN Book b on c.book_id = b.id JOIN Cart ca on ca.id = c.cart_id JOIN Transaction t on t.cart_id = ca.id WHERE t.status = 'completed' OR t.status = 'on delivery' ${filter} GROUP BY c.book_id ORDER BY Sold DESC LIMIT 5;`,
      );
      return topSalesProduct;
    } catch (error) {
      throw error;
    }
  };

  public getTransactionReportList = async (
    user: User,
    queryWarehouse: string | null,
    queryMonth: string | null,
    queryProduct: string | null,
    queryCategory: string | null,
    page: number | null,
    limit: number | null,
  ) => {
    try {
      let filterWarehouse = null;
      if (user.role === 'super admin') {
        if (queryWarehouse)
          filterWarehouse = deleteHypeninString(queryWarehouse);
      } else {
        const warehouseAdmin = await prisma.warehouse.findFirstOrThrow({
          where: {
            warehouse_admin_id: user?.id,
          },
        });
        filterWarehouse = warehouseAdmin.warehouse_name;
      }
      let filters = '';
      if (filterWarehouse) {
        filters += `AND ${filterWarehouse ? `w.warehouse_name = '${filterWarehouse}'` : ''}`;
      }
      if (queryMonth) {
        filters += `AND monthname(t.created_at)='${queryMonth}'`;
      }
      if (queryProduct) {
        filters += `AND b.book_name = '${deleteHypeninString(queryProduct)}'`;
      }
      if (queryCategory) {
        filters += `AND bc.book_category_name = '${deleteHypeninString(queryCategory)}'`;
      }
      let paginate = '';
      if (page) {
        const offset = (page - 1) * limit;
        paginate = `limit ${limit} offset ${offset}`;
      }
      const query = `select t.id, t.status, t.created_at as tDate, t.payment_method, w.warehouse_name, sum(ci.total_price) as transaction_revenue from Transaction t join Cart c on c.id = t.cart_id join CartItem ci on ci.cart_id = c.id join Warehouse w on t.warehouse_id = w.id join Book b on b.id = ci.book_id join BookCategory bc on bc.id = b.book_category_id WHERE (t.status = 'completed' OR t.status = 'on delivery') ${filters ?? ''} group by ci.cart_id order by t.id ASC`;
      const revenueData: [] = await prisma.$queryRawUnsafe(`${query}`);
      const revenuePerTransaction = await prisma.$queryRawUnsafe(
        `${query} ${paginate}`,
      );
      const totalPage = Math.ceil(revenueData.length / limit);
      return { revenuePerTransaction, totalPage };
    } catch (error) {
      throw error;
    }
  };

  public getOverviewStockReport = async (
    user: User,
    queryMonth: string | null,
    queryWarehouse: string | null,
  ) => {
    //Ringkasan laporan stok semua produk perbulan (total penambahan, total pengurangan dan stok akhir)
    try {
      const date = dateBetween;
      let filter = {};

      if (queryMonth) {
        filter = {
          ...filter,
          created_at: date[queryMonth.toLowerCase()],
        };
      }

      const role = user?.role;
      if (role === 'super admin') {
        if (queryWarehouse) {
          const warehouse = await prisma.warehouse.findFirstOrThrow({
            where: {
              warehouse_name: deleteHypeninString(queryWarehouse),
            },
          });
          filter = {
            ...filter,
            warehouseStock: {
              warehouse_id: warehouse.id,
            },
          };
        }
      } else {
        const warehouse = await prisma.warehouse.findFirstOrThrow({
          where: {
            warehouse_admin_id: user.id,
          },
        });
        filter = {
          ...filter,
          warehouseStock: {
            warehouse_id: warehouse.id,
          },
        };
      }

      const historyPlus = await prisma.jurnalStock.aggregate({
        where: {
          type: 'PLUS',
          ...filter,
        },
        _sum: {
          stockChange: true,
        },
      });
      const historyMinus = await prisma.jurnalStock.aggregate({
        where: {
          type: 'MINUS',
          ...filter,
        },
        _sum: {
          stockChange: true,
        },
      });
      const finalHistory = await prisma.jurnalStock.findMany({
        where: {
          ...filter,
        },
        orderBy: {
          created_at: 'desc',
        },
        distinct: ['warehouseStockId'],
      });
      console.log('🚀 ~ ReportQuery ~ finalHistory:', finalHistory);
      const totalLastStock = finalHistory.reduce((item, currentItem) => {
        return item + currentItem.newStock;
      }, 0);
      return {
        stockPlus: historyPlus?._sum?.stockChange || 0,
        stockMinus: historyMinus._sum.stockChange || 0,
        finalStock: totalLastStock,
      };
    } catch (error) {
      throw error;
    }
  };

  public getStockReportList = async (
    user: User,
    queryMonth: string | null,
    queryWarehouse: string | null,
    page: number | null,
    limit: number,
  ) => {
    try {
      const date = dateBetween;
      let filter = {};

      if (queryMonth) {
        filter = {
          ...filter,
          created_at: date[queryMonth.toLowerCase()],
        };
      }

      const role = user?.role;
      if (role === 'super admin') {
        if (queryWarehouse) {
          const warehouse = await prisma.warehouse.findFirstOrThrow({
            where: {
              warehouse_name: deleteHypeninString(queryWarehouse),
            },
          });
          filter = {
            ...filter,
            warehouseStock: {
              warehouse_id: warehouse.id,
            },
          };
        }
      } else {
        const warehouse = await prisma.warehouse.findFirstOrThrow({
          where: {
            warehouse_admin_id: user.id,
          },
        });
        filter = {
          ...filter,
          warehouseStock: {
            warehouse_id: warehouse.id,
          },
        };
      }
      const paginate =
        page > 0 && limit > 0 ? { take: limit, skip: (page - 1) * limit } : '';
      const fetchQuery = {
        where: {
          ...filter,
        },
        select: {
          id: true,
          oldStock: true,
          newStock: true,
          stockChange: true,
          type: true,
          created_at: true,
          message: true,
          warehouseStock: {
            select: {
              book: {
                select: {
                  book_name: true,
                },
              },
              warehouse: {
                select: {
                  warehouse_name: true,
                },
              },
            },
          },
        },
        ...paginate,
      };

      const [report, counts] = await prisma.$transaction([
        prisma.jurnalStock.findMany(fetchQuery),
        prisma.jurnalStock.count({ where: fetchQuery.where }),
      ]);

      const totalPages = Math.ceil(counts / limit) || 1;

      return { report, totalPages };
    } catch (error) {
      throw error;
    }
  };
}
