import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetUserCart = (id: number) => {
  return useQuery({
    queryKey: ['cart', id],
    queryFn: async () => {
      const res = await instance.get(`/cart/get-cart-id/${id}`);
      return res;
    },
    enabled: !!id,
  });
};
