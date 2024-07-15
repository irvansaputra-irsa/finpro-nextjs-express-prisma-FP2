'use client';
import * as Yup from 'yup';
import {
  Box,
  Divider,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { withFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import InnerForm from './component/InnerForm';
import {
  useProductMutation,
  useUpdateProductMutation,
} from '@/hooks/useProductMutation';
import { useSearchParams } from 'next/navigation';
import { useProductForm } from '@/hooks/useProduct';
import { product, productImage } from '@/interface/product.interface';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
export interface FormValues {
  bookName: string;
  bookDescription: string;
  bookAuthor: string;
  bookPublisher: string;
  bookPublishedYear: number;
  bookCategoryId: number;
  bookISBN: string;
  bookPrice: number;
  bookWeight: number;
  file: File[];
}

export interface FormProps {
  initialBookName?: string;
  initialBookDescription?: string;
  initialBookAuthor?: string;
  initialBookPublisher?: string;
  initialBookPublishedYear?: number;
  initialBookCategoryId?: number;
  initialBookISBN?: string;
  initialBookPrice?: number;
  initialBookWeight?: number;
  initialFile?: [];
  additionalProp?: productImage[];
}
export default function ProductForm() {
  const { mutate: createProduct } = useProductMutation();
  const { mutate: updateProduct } = useUpdateProductMutation();
  const param = useSearchParams();
  const slugProduct = param?.get('product_name') || '';
  const { data: book, isError: isErrFindProduct } = useProductForm(slugProduct);
  const bookData: product = book?.data.data;

  //persist form data after submit
  const persistFormValues = useRef({
    bookName: '',
    bookDescription: '',
    bookAuthor: '',
    bookPublisher: '',
    bookPublishedYear: 0,
    bookCategoryId: 0,
    bookISBN: '',
    bookPrice: 0,
    bookWeight: 0,
  });

  useEffect(() => {
    if (slugProduct && isErrFindProduct) {
      throw new Error('Product not found');
    }
  }, [isErrFindProduct, slugProduct]);

  const thisYear = new Date().getFullYear();
  const productSchema = Yup.object().shape({
    bookName: Yup.string().required('Book name is required'),
    bookDescription: Yup.string().required('Book Description is required'),
    bookAuthor: Yup.string().required('Author name is required'),
    bookPublisher: Yup.string().required('Publisher name is required'),
    bookPublishedYear: Yup.number()
      .positive('Please input valid year')
      .required('Book published year is required')
      .max(thisYear, 'Invalid year, please input the correct one'),
    bookCategoryId: Yup.number()
      .min(1, 'Please choose the category')
      .required('Please choose the category'),
    bookISBN: Yup.string().required('Book ISBN is required'),
    bookPrice: Yup.number()
      .min(1)
      .required('Book price is required')
      .positive('Please input valid price'),
    bookWeight: Yup.number()
      .required('Book weight is required')
      .positive('Please input valid weight'),
    file: Yup.mixed()
      .test('fileFormat', 'Format file not allowed', (value: any) => {
        if (value) {
          const supportedFormat: string[] = ['png', 'jpg', 'jpeg', 'gif'];
          for (let v of value) {
            const isCorrectFormat = supportedFormat.includes(
              v.name.split('.').pop(),
            );
            if (!isCorrectFormat) return false;
          }
          return true;
        }
      })
      .test(
        'fileSize',
        `File is too big, can't exceed ${Number(process.env.MAX_FILE_SIZE) / 1000000} MB`,
        (value: any) => {
          for (let v of value) {
            if (v.size > Number(process.env.MAX_FILE_SIZE)) return false;
          }
          return true;
        },
      ),
  });

  const validate = (values: FormValues) => {
    const errors: any = {};
    if (!(bookData?.BookImage || []).length) {
      if (!values.file?.length) {
        errors.file = 'Please upload some images';
      }
    }

    return errors;
  };

  const ProductForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      bookName:
        persistFormValues.current.bookName ||
        bookData?.book_name ||
        props.initialBookName ||
        '',
      bookDescription:
        persistFormValues.current.bookDescription ||
        bookData?.book_description ||
        props.initialBookDescription ||
        '',
      bookAuthor:
        persistFormValues.current.bookAuthor ||
        bookData?.book_author ||
        props.initialBookAuthor ||
        '',
      bookPublisher:
        persistFormValues.current.bookPublisher ||
        bookData?.book_publisher ||
        props.initialBookPublisher ||
        '',
      bookPublishedYear:
        persistFormValues.current.bookPublishedYear ||
        bookData?.book_published_year ||
        props.initialBookPublishedYear ||
        0,
      bookCategoryId:
        persistFormValues.current.bookCategoryId ||
        bookData?.book_category_id ||
        props.initialBookCategoryId ||
        0,
      bookISBN:
        persistFormValues.current.bookISBN ||
        bookData?.book_ISBN ||
        props.initialBookISBN ||
        '',
      bookPrice:
        persistFormValues.current.bookPrice ||
        bookData?.book_price ||
        props.initialBookPrice ||
        0,
      bookWeight:
        persistFormValues.current.bookWeight ||
        bookData?.book_weight ||
        props.initialBookWeight ||
        0,
      file: props.initialFile || [],
    }),
    validationSchema: productSchema,
    enableReinitialize: true,
    validate,
    handleSubmit({
      bookName,
      bookDescription,
      bookAuthor,
      bookPublisher,
      bookPublishedYear,
      bookCategoryId,
      bookISBN,
      bookPrice,
      bookWeight,
      file,
    }) {
      //filter non-ascii character
      const cleanerBookName = bookName.replaceAll(/[^\x00-\x7F]|[/]|[-]/g, ' ');
      submitData({
        bookName: cleanerBookName,
        bookDescription,
        bookAuthor,
        bookPublisher,
        bookPublishedYear,
        bookCategoryId,
        bookISBN,
        bookPrice,
        bookWeight,
        file,
      });
    },
  })(InnerForm);

  const submitData = async ({
    bookName,
    bookDescription,
    bookAuthor,
    bookPublisher,
    bookPublishedYear,
    bookCategoryId,
    bookISBN,
    bookPrice,
    bookWeight,
    file,
  }: FormValues) => {
    persistFormValues.current.bookAuthor = bookAuthor;
    persistFormValues.current.bookCategoryId = bookCategoryId;
    persistFormValues.current.bookDescription = bookDescription;
    persistFormValues.current.bookISBN = bookISBN;
    persistFormValues.current.bookName = bookName;
    persistFormValues.current.bookPrice = bookPrice;
    persistFormValues.current.bookPublishedYear = bookPublishedYear;
    persistFormValues.current.bookPublisher = bookPublisher;
    persistFormValues.current.bookWeight = bookWeight;

    const form = new FormData();
    form.set('book_name', bookName);
    form.set('book_description', bookDescription);
    form.set('book_author', bookAuthor);
    form.set('book_publisher', bookPublisher);
    form.set('book_published_year', bookPublishedYear.toString());
    form.set('book_category_id', bookCategoryId.toString());
    form.set('book_price', bookPrice.toString());
    form.set('book_ISBN', bookISBN);
    form.set('book_weight', bookWeight.toString());
    if (file && file?.length > 0) {
      file.forEach((el) => {
        form.append('files', el);
      });
    }
    if (slugProduct) {
      form.set('id', bookData?.id?.toString());
      updateProduct(form);
    } else {
      createProduct(form);
    }
  };
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
          {slugProduct ? 'Update Product' : 'Create Product'}
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
            <ProductForm additionalProp={bookData && bookData.BookImage} />
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
