import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

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

export const useProduct = (slug: string | undefined) => {
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
