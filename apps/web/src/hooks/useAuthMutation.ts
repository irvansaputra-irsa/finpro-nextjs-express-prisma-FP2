import { MutationOptions } from '@/types/mutation';
import instance from '@/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useRegisterMutation = ({
  onSuccess,
  onError,
}: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await instance.post(
        '/auth/register',
        { userEmail: data },
        { withCredentials: true },
      );
      return res;
    },
    onSuccess,
    onError,
  });
};

export const useVerifyMutation = ({ onSuccess, onError }: MutationOptions) => {
  return useMutation({
    mutationFn: async ({
      userEmail,
      userPassword,
      token,
    }: {
      userEmail: string;
      userPassword: string;
      token: string;
    }) => {
      const res = await instance.post(
        '/auth/verify',
        {
          userEmail: userEmail,
          userPassword: userPassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res;
    },
    onSuccess,
    onError,
  });
};

export const useLoginMutation = ({ onSuccess, onError }: MutationOptions) => {
  return useMutation({
    mutationFn: async ({
      userEmail,
      userPassword,
    }: {
      userEmail: string;
      userPassword: string;
    }) => {
      const res = await instance.post(
        '/auth/login',
        {
          userEmail: userEmail,
          userPassword: userPassword,
        },
        { withCredentials: true },
      );
      return res;
    },
    onSuccess,
    onError,
  });
};
