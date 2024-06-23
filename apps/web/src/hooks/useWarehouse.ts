import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useWarehouse = () => {
  return useQuery({
    queryKey: ['warehouse'],
    queryFn: async () => {
      const res = await instance.get(`/warehouse`);
      return res;
    },
  });
};
