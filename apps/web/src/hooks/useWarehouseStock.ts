import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetWarehouseStock = (id: number) => {
  return useQuery({
    queryKey: ['warehouse-stock'],
    queryFn: async () => {
      const res = await instance.get(`/stock/${id}?restrict=true`);
      return res;
    },
  });
};

export const useGetWarehouseStockOnMutationReq = (id: number) => {
  const stockList = useQuery({
    queryKey: ['warehouse-stock', id],
    queryFn: async () => {
      const res = await instance.get(`/stock/${id}`);
      return res;
    },
    enabled: !!id,
  });
  return { data: stockList.data };
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
