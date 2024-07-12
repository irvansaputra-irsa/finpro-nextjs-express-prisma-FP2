import { errorResponse } from '@/types/errorResponse';
import instance from '@/utils/axiosInstance';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useProductMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const res = await instance.post('/product/', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          BookName: form.get('book_name') as string,
        },
      });
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to submit',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-list'] });
      toast({
        title: 'Success',
        description: 'You have added one product',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      router.push('/dashboard/product-list');
    },
  });
};

export const useProductDeleteMutation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await instance.delete(`/product/${id}`);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to delete',
          description: res.message.includes('constraint')
            ? 'This book is used, cannot delete it right now'
            : 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-list'] });
      toast({
        title: 'Success',
        description: 'You have deleted one product',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useProductImageDeleteMutation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await instance.delete(`/product/image/${id}`);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to delete',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({
        title: 'Success',
        description: 'You have deleted one image',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const res = await instance.patch('/product', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          BookName: form.get('book_name') as string,
          BookId: form.get('id') as string,
        },
      });
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to update',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({
        title: 'Success',
        description: 'You have updated one product',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      router.push('/dashboard/product-list');
    },
  });
};

export const useCategoryProductDeleteMutation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await instance.delete(`/product-category/${id}`);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Failed to delete',
          description: res.message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-category'] });
      toast({
        title: 'Success',
        description: 'You have deleted one product category',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useCategoryMutation = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { bookCategoryName: string }) => {
      const res = await instance.post(`/product-category`, payload);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        let message = res?.message;
        if (res?.message.toLowerCase().includes('unique constraint'))
          message = 'Book Category already exist, please input another one!';
        toast({
          title: 'Failed to create',
          description: message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-category'] });
      toast({
        title: 'Success',
        description: 'You have created one product category',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/dashboard/product-category-list');
    },
  });
};

type productCategory = {
  bookCategoryId: number;
  bookCategoryName: string;
};

export const useCategoryProductUpdateMutation = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: productCategory) => {
      const res = await instance.patch(`/product-category`, payload);
      return res;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as errorResponse;
        let message = res?.message;
        if (res?.message.toLowerCase().includes('unique constraint'))
          message = 'Book Category already exist, please input another one!';
        toast({
          title: 'Failed to update',
          description: message || 'An error occurred while submitting.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-category'] });
      toast({
        title: 'Success',
        description: 'You have updated one product category',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/dashboard/product-category-list');
    },
  });
};
