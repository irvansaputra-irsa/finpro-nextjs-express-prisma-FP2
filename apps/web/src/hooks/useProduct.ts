import instance from '@/utils/axiosInstance';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useProductCategory = () => {
  return useQuery({
    queryKey: ['product-category'],
    queryFn: async () => {
      const res = await instance.get('/product-category');
      return res;
    },
  });
};

export const useProductDashboard = () => {
  return useQuery({
    queryKey: ['product'],
    queryFn: async () => {
      const res = await instance.get('/product');
      return res;
    },
  });
};

export const useProductForm = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (slug) {
        const res = await instance.get(`/product/${slug}`);
        return res;
      }
    },
    enabled: !!slug,
  });
};

export const useProductCategoryDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product-category'],
    queryFn: async () => {
      if (slug) {
        const res = await instance.get(`/product-category/${slug}`);
        return res;
      }
    },
    enabled: !!slug,
  });
};

export const useProductListCustomer = (
  page: number,
  limit: number,
  sort: string = '',
  search: string = '',
  categoryFilter: string = '',
) => {
  return useQuery({
    queryKey: ['product-list', page, categoryFilter, sort, search],
    queryFn: async () => {
      const res = await instance.get(
        `/product?page=${page}&limit=${limit}&category=${categoryFilter}&sort=${sort}&search=${search}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProductListDashboard = (
  page: number,
  limit: number,
  search: string = '',
  sort: string = '',
  orderSort: string | null = '',
  // categoryFilter: string = '',
) => {
  return useQuery({
    queryKey: ['product-list', page, sort, search, orderSort],
    queryFn: async () => {
      const res = await instance.get(
        `/product/dashboard?page=${page}&limit=${limit}&sort=${sort}&order=${orderSort}&search=${search}`,
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProductDetailCustomer = (bookName: string) => {
  return useQuery({
    queryKey: ['product-detail', bookName],
    queryFn: async () => {
      const res = await instance.get(`product/${bookName}`);
      return res;
    },
  });
};

export const useProductsName = () => {
  return useQuery({
    queryKey: ['product-list-name'],
    queryFn: async () => {
      const res = await instance.get('product/lists');
      return res;
    },
  });
};
