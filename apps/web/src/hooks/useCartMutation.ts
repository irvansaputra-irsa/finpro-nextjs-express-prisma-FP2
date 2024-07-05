import instance from '@/utils/axiosInstance';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: addCart) => {
      if (payload?.userId) {
        const res = await instance.post(`cart/add-item`, payload);
        return res;
      }
    },
    onSuccess: (data) => {
      const id = data?.data?.cartId || 0;
      queryClient.invalidateQueries({
        queryKey: ['cart', id],
      });
      toast({
        title: 'Success',
        description: 'You have updated one product quantity on your cart',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (err) => {
      const res = err.response?.data as Error;
      toast({
        title: 'Failed to add product',
        description: res.message || 'An error occurred while submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
  });
};
