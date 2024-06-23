import instance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';

export const useCreateCartMutation = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await instance.post(`cart/get-cart-id`, { userId: id });
      return res;
    },
  });
};

export interface addCart {
  bookId: number;
  quantity: number;
  userId: number;
}
export const useAddProductCartMutation = () => {
  return useMutation({
    mutationFn: async (payload: addCart) => {
      const res = await instance.post(`cart/add-item`, payload);
      return res;
    },
  });
};
