import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetWarehouseStock = (id: number) => {
  return useQuery({
    queryKey: ['warehouse-stock'],
    queryFn: async () => {
      const res = await instance.get(`/stock/${id}`);
      return res;
    },
  });
};
