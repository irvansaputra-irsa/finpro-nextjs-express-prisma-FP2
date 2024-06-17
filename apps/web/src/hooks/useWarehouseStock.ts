import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetWarehouseStock = (id: number) => {
  return useQuery({
    queryKey: ['warehouse-stock', id],
    queryFn: async () => {
      const res = await instance.get(`/stock/${id}`);
      return res;
    },
  });
};

export const useGetAnotherProductOnWarehouse = (id: number) => {
  return useQuery({
    queryKey: ['list-warehouse-product'],
    queryFn: async () => {
      const res = await instance.get(`/stock/new/${id}`);
      return res;
    },
  });
};
