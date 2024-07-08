import { IaddStock, IremoveStock } from '@/interface/stock.interface';
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
      queryClient.invalidateQueries({
        queryKey: [`warehouse-stock`],
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

export const useDeleteProductWarehouseMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await instance.delete(`/stock/${id}`);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to delete product at this warehouse',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['warehouse-stock'],
      });
      toast({
        title: 'Success',
        description: 'Product successfully deleted at this warehouse',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
  });
};

export const useRemoveStockMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: IremoveStock) => {
      const res = await instance.patch('/stock/remove', payload);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to remove stock',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`warehouse-stock`],
      });
      toast({
        title: 'Success',
        description: 'Product stock successfully removed',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
  });
};
