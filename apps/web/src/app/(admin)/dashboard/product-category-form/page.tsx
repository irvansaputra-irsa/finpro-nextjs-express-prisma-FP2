'use client';
import { Box, Divider, GridItem, Heading, SimpleGrid } from '@chakra-ui/react';
import { withFormik } from 'formik';

import InnerForm from './component/InnerForm';
import { useSearchParams } from 'next/navigation';
import {
  useCategoryMutation,
  useCategoryProductUpdateMutation,
} from '@/hooks/useProductMutation';
import { useProductCategoryDetail } from '@/hooks/useProduct';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (slugProduct && isErrFindProduct) {
      throw new Error('Category not found');
    }
  }, [isErrFindProduct, slugProduct]);

  const CategoryForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      bookCategoryName:
        categoryData.book_category_name || props.initialBookCategoryName || '',
    }),
    enableReinitialize: true,
    handleSubmit: ({ bookCategoryName }) => {
      if (slugProduct) {
        updateCategory({
          bookCategoryId: Number(slugProduct),
          bookCategoryName: bookCategoryName,
        });
      } else createCategory({ bookCategoryName });
    },
  })(InnerForm);
  return (
    <Box
      bg="#edf3f8"
      _dark={{
        bg: '#111',
      }}
      p={10}
    >
      <Heading size={'2xl'}>
        {slugProduct ? 'Update Category' : 'Create New Category'}
      </Heading>
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
      <Box>
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
