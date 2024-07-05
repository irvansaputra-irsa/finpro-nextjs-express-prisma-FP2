import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetRevenueMonth = (
  filterCategory: string,
  filterProduct: string,
  filterWarehouse: number,
) => {
  return useQuery({
    queryKey: [
      'revenue',
      { filterCategory: filterCategory },
      { filterProduct: filterProduct },
      { filterWarehouse: filterWarehouse },
    ],
    queryFn: async () => {
      const res = await instance.get(
        `/report/revenue?_category=${filterCategory}&_product=${filterProduct}&_warehouse=${filterWarehouse}`,
      );
      return res;
    },
  });
};

export const useGetTopSellingProduct = () => {
  return useQuery({
    queryKey: ['top-selling-product'],
    queryFn: async () => {
      const res = await instance.get(`report/top-selling`);
      return res;
    },
  });
};
