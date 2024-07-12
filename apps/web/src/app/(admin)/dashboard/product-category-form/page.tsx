'use client';
import {
  Box,
  Divider,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import InnerForm from './component/InnerForm';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCategoryMutation,
  useCategoryProductUpdateMutation,
} from '@/hooks/useProductMutation';
import { useProductCategoryDetail } from '@/hooks/useProduct';
import { useEffect, useRef } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';

export interface FormValues {
  bookCategoryName: string;
}

export interface FormProps {
  initialBookCategoryName?: string;
}

export default function ProductCategoryForm() {
  const { mutate: createCategory } = useCategoryMutation();
  const { mutate: updateCategory } = useCategoryProductUpdateMutation();
  const param = useSearchParams();
  const slugProduct = param?.get('category_id') || '';

  const { data, isError: isErrFindProduct } =
    useProductCategoryDetail(slugProduct);

  const categoryData = data?.data?.data || '';

  const persistFormValues = useRef({ bookCategoryName: '' });

  useEffect(() => {
    if (slugProduct && isErrFindProduct) {
      throw new Error('Category not found');
    }
  }, [isErrFindProduct, slugProduct]);

  const categorySchema = Yup.object().shape({
    bookCategoryName: Yup.string().required('Book category name is required'),
  });

  const CategoryForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      bookCategoryName:
        persistFormValues.current.bookCategoryName ||
        categoryData.book_category_name ||
        props.initialBookCategoryName ||
        '',
    }),
    enableReinitialize: true,
    validationSchema: categorySchema,
    handleSubmit: ({ bookCategoryName }) => {
      persistFormValues.current.bookCategoryName = bookCategoryName;
      if (slugProduct) {
        updateCategory({
          bookCategoryId: Number(slugProduct),
          bookCategoryName: bookCategoryName,
        });
      } else createCategory({ bookCategoryName });
    },
  })(InnerForm);
  const { back } = useRouter();
  return (
    <Box
      bg="#edf3f8"
      _dark={{
        bg: '#111',
      }}
      p={10}
    >
      <Flex gap={5} alignItems={'center'}>
        <ArrowBackIcon
          boxSize={'40px'}
          my={5}
          cursor={'pointer'}
          onClick={() => back()}
        />
        <Heading size={'2xl'} color={'orange'}>
          {slugProduct ? 'Update Category' : 'Create New Category'}
        </Heading>
      </Flex>
      <Divider
        my="5"
        borderColor="gray.300"
        _dark={{
          borderColor: 'whiteAlpha.300',
        }}
        visibility={{
          base: 'hidden',
          sm: 'visible',
        }}
      />
      <Box w={{ '2xl': '50%' }}>
        <SimpleGrid
          display={{
            base: 'initial',
            md: 'grid',
          }}
          spacing={{
            md: 6,
          }}
        >
          <GridItem
            mt={[5, null, 0]}
            overflow={{ sm: 'hidden' }}
            borderRadius={10}
          >
            <CategoryForm />
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
