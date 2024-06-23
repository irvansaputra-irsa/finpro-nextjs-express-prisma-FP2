import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetWarehouseMutation = (id: number) => {
  return useQuery({
    queryKey: ['mutation-request'],
    queryFn: async () => {
      const res = await instance.get(`/mutation`);
      return res;
    },
  });
};
