'use client';
import { Flex, Stack, Image, useToast } from '@chakra-ui/react';
import { withFormik } from 'formik';
import React from 'react';
import InnerForm from './components/innerForm';
import { useRegisterMutation } from '@/hooks/useAuthMutation';
import axios, { AxiosError } from 'axios';
import * as Yup from 'yup';
import { ValidationError } from '@/types/validationError';

export interface FormValues {
  userEmail: string;
}

export interface FormProps {
  initialUserEmail?: string;
}

export default function RegisterPage() {
  const registerSchema = Yup.object().shape({
    userEmail: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
  });
  const toast = useToast();
  const { mutate, error } = useRegisterMutation({
    onSuccess: () => {
      toast({
        title: 'User Registered.',
        description: 'Please check your email',
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

  const RegisterForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      userEmail: props.initialUserEmail || '',
    }),
    validationSchema: registerSchema,
    enableReinitialize: true,
    handleSubmit({ userEmail }: FormValues, { resetForm }) {
      mutate(userEmail);
      resetForm();
    },
  })(InnerForm);

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={5} w={'full'} maxW={'md'}>
          <RegisterForm />
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Register Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2698&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        />
      </Flex>
    </Stack>
  );
}
