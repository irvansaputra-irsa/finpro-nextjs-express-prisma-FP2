import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { Field, Form, FormikProps } from 'formik';
import { FormValues } from '../page';

export default function InnerForm(props: FormikProps<FormValues>) {
  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    props;
  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={5} w={'full'} maxW={'md'}>
        <Heading fontSize={'2xl'}>Set your password</Heading>
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
          ></Stack>
          <Button
            colorScheme={'blue'}
            variant={'solid'}
            disabled={isSubmitting}
            type="submit"
          >
            Save Password and Verify
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
