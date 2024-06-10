import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import React from 'react';
import { Field, Form, FormikProps } from 'formik';
import { FormValues } from '../page';

export default function InnerForm(props: FormikProps<FormValues>) {
  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    props;
  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={5} w={'full'} maxW={'md'}>
        <Heading fontSize={'2xl'}>Sign in</Heading>
        <FormControl
          id="email"
          isInvalid={!!errors.userEmail && touched.userEmail}
        >
          <FormLabel>Email address</FormLabel>
          <Field
            name="userEmail"
            id="userEmail"
            as={Input}
            rounded="md"
            type="email"
            value={values.userEmail}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.userEmail}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="password"
          isInvalid={!!errors.userPassword && touched.userPassword}
        >
          <FormLabel>Password</FormLabel>
          <Field
            name="userPassword"
            id="userPassword"
            as={Input}
            rounded="md"
            type="password"
            value={values.userPassword}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.userPassword}</FormErrorMessage>
        </FormControl>
        <Stack spacing={6}>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            align={'start'}
            justify={'space-between'}
          >
            <Checkbox>Remember me</Checkbox>
            <Link href={'#'} color={'blue.500'}>
              Forgot password?
            </Link>
          </Stack>
          <Button
            colorScheme={'blue'}
            variant={'solid'}
            disabled={isSubmitting}
            type="submit"
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
