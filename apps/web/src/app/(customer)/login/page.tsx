'use client';
import { Flex, Image, Stack, useToast } from '@chakra-ui/react';
import { withFormik } from 'formik';
import React, { useContext } from 'react';
import * as Yup from 'yup';
import InnerForm from './components/innerForm';
import { useLoginMutation } from '@/hooks/useAuthMutation';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ValidationError } from '@/types/validationError';
import Cookies from 'js-cookie';
import { AuthContext } from '@/context/Auth';
import parseJWT from '@/utils/parseJwt';

export interface FormValues {
  userEmail: string;
  userPassword: string;
}

export interface FormProps {
  initialUserEmail?: string;
  initialUserPassword?: string;
}

export default function LoginPage() {
  const { useLogin: UseLogin } = useContext(AuthContext);
  const router = useRouter();
  const toast = useToast();
  const loginSchema = Yup.object().shape({
    userEmail: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
    userPassword: Yup.string().required('Password is required'),
  });
  const { mutate } = useLoginMutation({
    onSuccess: (data: any) => {
      const token = String(data?.data?.data?.token);
      const userDetail = parseJWT(token);
      UseLogin(userDetail, token);
      if (userDetail.role.toLowerCase() === 'user') router.push('/');
      else router.push('/dashboard');
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
  const LoginForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      userEmail: props.initialUserEmail || '',
      userPassword: props.initialUserPassword || '',
    }),
    validationSchema: loginSchema,
    enableReinitialize: true,
    handleSubmit({ userEmail, userPassword }: FormValues, { resetForm }) {
      mutate({ userEmail, userPassword });
      resetForm();
    },
  })(InnerForm);
  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={5} w={'full'} maxW={'md'}>
          <LoginForm />
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2698&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        />
      </Flex>
    </Stack>
  );
}
