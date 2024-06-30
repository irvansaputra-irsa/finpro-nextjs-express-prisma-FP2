import instance from '@/utils/axiosInstance';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useGetWarehouseMutation = (
  id: number,
  pageOutcome: number,
  pageIncome: number,
  limit: number,
) => {
  return useQuery({
    queryKey: [
      'warehouse-mutation-request',
      { warehouse_id: id },
      { pageIncoming: pageIncome },
      { pageOutcoming: pageOutcome },
    ],
    queryFn: async () => {
      const res = await instance.get(
        `/mutation?id=${id}&pageIncoming=${pageIncome}&pageOutcoming=${pageOutcome}&limit=${limit}`,
      );
      return res;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};
