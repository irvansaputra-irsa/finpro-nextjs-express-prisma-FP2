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

export const useFindWarehouseByAdmin = (id: number) => {
  return useQuery({
    queryKey: ['warehouse-admin'],
    queryFn: async () => {
      const res = await instance.get(`/warehouse/admin/${id}`);
      return res;
    },
    enabled: !!id,
  });
};

export const useListWarehouse = () => {
  return useQuery({
    queryKey: ['warehouse-list'],
    queryFn: async () => {
      const res = await instance.get(`/warehouse/list`);
      return res;
    },
  });
};
