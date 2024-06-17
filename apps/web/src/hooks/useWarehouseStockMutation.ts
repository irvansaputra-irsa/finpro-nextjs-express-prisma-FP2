import { IaddStock } from '@/interface/stock.interface';
import { errorResponse } from '@/types/errorResponse';
import instance from '@/utils/axiosInstance';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useAddStockMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: IaddStock) => {
      const res = await instance.patch('/stock', payload);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to add stock',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: (data) => {
      const warehouseId = data.data.data.warehouseStock.warehouse.id;
      queryClient.invalidateQueries({
        queryKey: [`warehouse-stock`, warehouseId],
      });
      toast({
        title: 'Success',
        description: 'Product stock successfully added',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
  });
};

type ProductWarehouse = {
  bookId: number;
  warehouseId: number;
};

export const useAddProductWarehouseMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: ProductWarehouse) => {
      const res = await instance.post('/stock', payload);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to add product',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`list-warehouse-product`],
      });
      toast({
        title: 'Success',
        description: 'Product successfully added to this warehouse',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
  });
};
