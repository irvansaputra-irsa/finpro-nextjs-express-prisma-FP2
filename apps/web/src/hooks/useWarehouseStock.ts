import instance from '@/utils/axiosInstance';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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

export const useGetAnotherProductOnWarehouse = (
  id: number,
  page: number,
  search: string,
) => {
  const limit = 8;
  return useQuery({
    queryKey: ['list-warehouse-product', { page, limit, search }],
    queryFn: async () => {
      const res = await instance.get(
        `/stock/new/${id}?_page=${page}&_limit=${limit}&_search=${search}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};
