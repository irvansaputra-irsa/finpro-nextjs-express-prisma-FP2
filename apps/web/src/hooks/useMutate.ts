import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetWarehouseMutation = (id: number) => {
  return useQuery({
    queryKey: ['warehouse-mutation-request', { warehouse_id: id }],
    queryFn: async () => {
      const res = await instance.get(`/mutation?warehouse=${id}`);
      return res;
    },
  });
};
