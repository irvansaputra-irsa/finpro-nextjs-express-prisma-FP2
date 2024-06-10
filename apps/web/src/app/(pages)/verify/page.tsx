'use client';

import React from 'react';
import { Flex, Image, Stack, useToast } from '@chakra-ui/react';
import { withFormik } from 'formik';
import InnerForm from './components/innerForm';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyMutation } from '@/hooks/useAuthMutation';
import parseJWT from '@/utils/parseJwt';
import axios, { AxiosError } from 'axios';
import { ValidationError } from '@/types/validationError';

export interface FormValues {
  userPassword: string;
}

export interface FormProps {
  initialUserPassword?: string;
}
export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();
  const router = useRouter();
  const { mutate } = useVerifyMutation({
    onSuccess: () => {
      router.push('/login');
      toast({
        title: 'User Verified.',
        description: 'Please login to your account',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
    onError: (error: AxiosError) => {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        const errorMessage =
          error.response?.data?.message || 'An error occurred';
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const verifySchema = Yup.object().shape({
    userPassword: Yup.string()
      .required('No password provided.')
      .min(8, 'Password is too short - should be 8 chars minimum.'),
    // .matches(/[^a-zA-Z0-9]/, 'Password can only contain Alphanumeric.'),
  });
  const VerifyForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      userPassword: props.initialUserPassword || '',
    }),
    validationSchema: verifySchema,
    enableReinitialize: true,
    handleSubmit: async ({ userPassword }: FormValues, { resetForm }) => {
      if (token) {
        const { userEmail } = await parseJWT(token);
        mutate({ userEmail, userPassword, token });
      }
    },
  })(InnerForm);

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={5} w={'full'} maxW={'md'}>
          <VerifyForm />
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Verify Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2698&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        />
      </Flex>
    </Stack>
  );
}
