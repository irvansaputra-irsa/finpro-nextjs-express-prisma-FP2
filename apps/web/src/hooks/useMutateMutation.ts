import instance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';

export interface reqProductMutation {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  bookId: number;
  qty: number;
  senderName: string;
  senderNotes: string;
}

export const useRequestProductMutation = () => {
  return useMutation({
    mutationFn: async (payload: reqProductMutation) => {
      const res = await instance.post('/mutation', payload);
      return res;
    },
  });
};
