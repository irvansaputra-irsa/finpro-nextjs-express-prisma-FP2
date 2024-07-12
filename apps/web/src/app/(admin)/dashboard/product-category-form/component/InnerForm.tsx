import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  InputGroup,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { Field, Form, FormikProps } from 'formik';
import { FormValues } from '../page';

export default function InnerForm(props: FormikProps<FormValues>) {
  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    props;
  return (
    <Form onSubmit={handleSubmit}>
      <Stack
        px={4}
        py={5}
        bg="white"
        _dark={{
          bg: '#141517',
        }}
        spacing={6}
        p={{
          sm: 6,
        }}
      >
        <SimpleGrid columns={6} spacing={6}>
          <FormControl
            as={GridItem}
            colSpan={[6, 3]}
            isInvalid={!!errors.bookCategoryName && touched.bookCategoryName}
          >
            <FormLabel
              htmlFor="category-name"
              fontSize="sm"
              fontWeight={'bold'}
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              Category name
            </FormLabel>
            <InputGroup size="sm" p={3}>
              <Field
                as={Input}
                type="text"
                name="bookCategoryName"
                id="bookCategoryName"
                autoComplete="given-name"
                mt={1}
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                value={values.bookCategoryName}
                onChange={handleChange}
              />
            </InputGroup>
            <FormErrorMessage px={3}>
              {errors.bookCategoryName}
            </FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Stack>
      <Box
        px={{
          base: 4,
          sm: 6,
        }}
        py={3}
        bg="gray.50"
        _dark={{
          bg: '#121212',
        }}
        textAlign="right"
      >
        <Button
          type="submit"
          colorScheme="orange"
          _focus={{
            shadow: '',
          }}
          fontWeight="md"
          isDisabled={isSubmitting}
        >
          Save
        </Button>
      </Box>
    </Form>
  );
}
