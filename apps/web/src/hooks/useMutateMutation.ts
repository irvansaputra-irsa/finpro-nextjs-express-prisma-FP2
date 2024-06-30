import { errorResponse } from '@/types/errorResponse';
import instance from '@/utils/axiosInstance';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface reqProductMutation {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  bookId: number;
  qty: number;
  senderName: string;
  senderNotes: string | null;
}

export interface acceptProductMutation {
  id: number;
  receiverName: string;
  receiverNotes: string;
}

export const useRequestProductMutation = () => {
  return useMutation({
    mutationFn: async (payload: reqProductMutation) => {
      await instance.post('/mutation', payload);
    },
  });
};

export const useCancelProductMutation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await instance.post('/mutation/canceled', { id });
      return res;
    },
    onError: (err) => {
      const res = err.response?.data as errorResponse;
      toast({
        title: 'Failed to cancel request',
        description: res.message || 'An error occurred while submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      const warehouseId = data?.data?.data?.from_warehouse_id || 0;
      queryClient.invalidateQueries({
        queryKey: ['warehouse-mutation-request', { warehouse_id: warehouseId }],
      });
      toast({
        title: 'Success',
        description: 'You have canceled one mutation request',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useAcceptProductMutation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: acceptProductMutation) => {
      const res = await instance.post('/mutation/accepted', payload);
      return res;
    },
    onError: (err) => {
      const res = err.response?.data as errorResponse;
      toast({
        title: 'Failed to accept request',
        description: res.message || 'An error occurred while submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      const warehouseId = data?.data?.data?.to_warehouse_id || 0;
      queryClient.invalidateQueries({
        queryKey: ['warehouse-mutation-request', { warehouse_id: warehouseId }],
      });
      toast({
        title: 'Success',
        description: 'You have accepted one mutation request',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useRejectProductMutation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: acceptProductMutation) => {
      const res = await instance.post('/mutation/rejected', payload);
      return res;
    },
    onError: (err) => {
      const res = err.response?.data as errorResponse;
      toast({
        title: 'Failed to reject request',
        description: res.message || 'An error occurred while submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      const warehouseId = data?.data?.data?.to_warehouse_id || 0;
      queryClient.invalidateQueries({
        queryKey: ['warehouse-mutation-request', { warehouse_id: warehouseId }],
      });
      toast({
        title: 'Success',
        description: 'You have rejected one mutation request',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};
