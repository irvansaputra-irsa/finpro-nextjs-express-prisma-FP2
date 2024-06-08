import {
  FormControl,
  FormLabel,
  Box,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FormikProps, Form, Field } from 'formik';
import { FormValues } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

export default function InnerForm(props: FormikProps<FormValues>) {
  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box>
      <Form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel htmlFor="email">Email </FormLabel>
            <Field
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email}
              style={{
                padding: '5px',
                border: '0.5px solid grey',
                borderRadius: '5px',
              }}
            />
            {touched.email && errors.email && (
              <Text
                m={'2'}
                textAlign={'center'}
                sx={{
                  color: 'red',
                }}
              >
                {errors.email}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password :</FormLabel>
            <Field
              name="password"
              type="password"
              onChange={handleChange}
              value={values.password}
              style={{
                padding: '5px',
                border: '0.5px solid grey',
                borderRadius: '5px',
              }}
            />
            {touched.password && errors.password && (
              <Text
                m={'2'}
                textAlign={'center'}
                sx={{
                  color: 'red',
                }}
              >
                {errors.password}
              </Text>
            )}
          </FormControl>
          <Link href="/sign-in">
            <Text
              color={'blue.400'}
              textAlign={'center'}
              _hover={{ color: 'blue.500' }}
            >
              Already have account?
            </Text>
          </Link>
          <Button
            sx={{
              marginTop: '15px',
            }}
            type="submit"
            disabled={isSubmitting}
            bg={'green.400'}
            color={'white'}
            _hover={{
              bg: 'green.500',
            }}
          >
            Submit
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
