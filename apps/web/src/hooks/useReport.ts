import instance from '@/utils/axiosInstance';
import { separateStringHyphen } from '@/utils/convert';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useGetRevenueMonth = (
  filterCategory: string,
  filterProduct: string,
  filterWarehouse: string,
) => {
  return useQuery({
    queryKey: ['revenue', { filterCategory, filterProduct, filterWarehouse }],
    queryFn: async () => {
      const res = await instance.get(
        `/report/revenue?_category=${separateStringHyphen(filterCategory)}&_product=${separateStringHyphen(filterProduct)}&_warehouse=${separateStringHyphen(filterWarehouse)}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetTopSellingProduct = (
  filterWarehouse: string,
  filterMonth: string,
) => {
  return useQuery({
    queryKey: ['top-selling-product', { filterWarehouse, filterMonth }],
    queryFn: async () => {
      const res = await instance.get(
        `report/top-selling?_warehouse=${separateStringHyphen(filterWarehouse)}&_month=${filterMonth}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useReportTransaction = (
  filterWarehouse: string,
  filterMonth: string,
  filterProduct: string,
  filterCategory: string,
  page: number,
) => {
  return useQuery({
    queryKey: [
      'transaction-report',
      { filterWarehouse, filterMonth, filterProduct, filterCategory, page },
    ],
    queryFn: async () => {
      const limit = 10;
      const res = await instance.get(
        `report/sales-list?_warehouse=${separateStringHyphen(filterWarehouse)}&_month=${filterMonth}&_product=${separateStringHyphen(filterProduct)}&_category=${filterCategory}&_page=${page}&_limit=${limit}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useReportStockOverview = (
  filterWarehouse: string,
  filterMonth: string,
) => {
  return useQuery({
    queryKey: ['stock-overview', { filterWarehouse, filterMonth }],
    queryFn: async () => {
      const res = await instance.get(
        `report/stock-overview?_warehouse=${separateStringHyphen(filterWarehouse)}&_month=${filterMonth}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useReportStock = (
  filterWarehouse: string,
  filterMonth: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ['stock-report', { filterWarehouse, filterMonth, page, limit }],
    queryFn: async () => {
      const res = await instance.get(
        `report/stock-list?_warehouse=${separateStringHyphen(filterWarehouse)}&_month=${filterMonth}&_page=${page}&_limit=${limit}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};
