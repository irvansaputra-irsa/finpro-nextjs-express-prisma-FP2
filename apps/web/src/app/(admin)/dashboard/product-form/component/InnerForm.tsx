import React, { useEffect, useState } from 'react';
import { productCategory, productImage } from '@/interface/product.interface';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VisuallyHidden,
  chakra,
} from '@chakra-ui/react';
import { useProductCategory } from '@/hooks/useProduct';
import { Field, Form } from 'formik';
import { MdDeleteForever } from 'react-icons/md';
import { useProductImageDeleteMutation } from '@/hooks/useProductMutation';

interface OtherProps {
  additionalProp: productImage[];
}

interface Preview {
  source: string;
  imageName?: string;
  bookId?: number;
}

// export default function InnerForm(props: OtherProps & FormikProps<FormValues>) {
export default function InnerForm(props: any) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    additionalProp,
  } = props;
  // const handleChanges = (e: ChangeEvent<HTMLInputElement>): void => {
  //   const filter: string = e.target.value.replace(/\D/g, '');
  //   const newValue: string = filter.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //   setValue(newValue);
  // };
  const [preview, setPreview] = useState<Preview[]>([]);
  const { data: categoryData } = useProductCategory();
  const { mutate: mutateDeleteImage } = useProductImageDeleteMutation();

  useEffect(() => {
    if (additionalProp) {
      const formatted = additionalProp?.map((el: productImage) => ({
        source: `${process.env.NEXT_PUBLIC_IMAGE_URL}/products/${el.book_image}`,
        bookId: el.id,
      }));
      setPreview(formatted);
    }
  }, [additionalProp]);

  const uploadImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setPreview([
        ...preview,
        { source: URL.createObjectURL(img), imageName: img.name },
      ]);

      const currImage = values.file;
      if (currImage) {
        setFieldValue('file', [...currImage, img]);
      } else {
        setFieldValue('file', [img]);
      }
    }
  };

  const deleteImg = (images: Preview): void => {
    const afterDelete = [...preview].filter(
      (el) => el.source !== images.source,
    );
    setPreview(afterDelete);

    if (images?.bookId) {
      mutateDeleteImage(images?.bookId);
    } else {
      const filterDel = values.file?.filter((el: any) => {
        return el.name !== images.imageName;
      });
      setFieldValue('file', filterDel);
    }
  };

  return (
    <>
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
          <SimpleGrid columns={3} spacing={6}>
            <FormControl
              as={GridItem}
              colSpan={[3, 2]}
              isInvalid={!!errors.bookName && touched.bookName}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
              >
                Book name
              </FormLabel>
              <InputGroup size="sm">
                <Field
                  as={Input}
                  type="text"
                  placeholder="ex. Jungle Book"
                  focusBorderColor="brand.400"
                  rounded="md"
                  value={values.bookName}
                  name="bookName"
                  id="bookName"
                  onChange={handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{errors.bookName}</FormErrorMessage>
            </FormControl>

            <FormControl
              as={GridItem}
              colSpan={[3, 1]}
              isInvalid={
                !!errors.bookPublishedYear && touched.bookPublishedYear
              }
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
              >
                Published year
              </FormLabel>
              <InputGroup size="sm">
                <Field
                  as={Input}
                  type="number"
                  placeholder="ex. 2005"
                  focusBorderColor="brand.400"
                  rounded="md"
                  value={values.bookPublishedYear}
                  name="bookPublishedYear"
                  id="bookPublishedYear"
                  onChange={handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{errors.bookPublishedYear}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl
            as={GridItem}
            colSpan={[6, 3]}
            isInvalid={!!errors.bookCategoryId && touched.bookCategoryId}
          >
            <FormLabel
              htmlFor="Category"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              Category
            </FormLabel>
            <Field
              as={Select}
              id="bookCategory"
              name="bookCategoryId"
              autoComplete="bookCategoryId"
              placeholder="Select option"
              mt={1}
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
            >
              {categoryData?.data.data.map((el: productCategory) => (
                <option key={el.id} value={el.id}>
                  {el.book_category_name}
                </option>
              ))}
            </Field>
            <FormErrorMessage>{errors.bookCategoryId}</FormErrorMessage>
          </FormControl>

          <div>
            <FormControl
              id="email"
              mt={1}
              isInvalid={!!errors.bookDescription && touched.bookDescription}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
              >
                Book description
              </FormLabel>
              <Field
                as={Textarea}
                placeholder="write it here..."
                mt={1}
                rows={3}
                shadow="sm"
                focusBorderColor="brand.400"
                fontSize={{
                  sm: 'sm',
                }}
                value={values.bookDescription}
                name="bookDescription"
                id="bookDescription"
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.bookDescription}</FormErrorMessage>
            </FormControl>
          </div>

          <FormControl isInvalid={!!errors.bookAuthor && touched.bookAuthor}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              Author Name
            </FormLabel>
            <InputGroup size="sm">
              <Field
                as={Input}
                type="text"
                placeholder="ex. J. K. Rowling"
                focusBorderColor="brand.400"
                rounded="md"
                value={values.bookAuthor}
                name="bookAuthor"
                id="bookAuthor"
                onChange={handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{errors.bookAuthor}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors.bookPublisher && touched.bookPublisher}
          >
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              Publisher
            </FormLabel>
            <InputGroup size="sm">
              <Field
                as={Input}
                type="text"
                placeholder="ex. Bukune"
                focusBorderColor="brand.400"
                rounded="md"
                value={values.bookPublisher}
                name="bookPublisher"
                id="bookPublisher"
                onChange={handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{errors.bookPublisher}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.bookISBN && touched.bookISBN}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              ISBN
            </FormLabel>
            <InputGroup size="sm">
              <Field
                as={Input}
                type="number"
                placeholder="ex. 9786232622593"
                focusBorderColor="brand.400"
                rounded="md"
                value={values.bookISBN}
                name="bookISBN"
                id="bookISBN"
                onChange={handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{errors.bookISBN}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={3} spacing={6}>
            <FormControl
              as={GridItem}
              colSpan={[3, 1]}
              isInvalid={!!errors.bookPrice && touched.bookPrice}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
              >
                Price
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftAddon
                  bg="gray.50"
                  _dark={{
                    bg: 'gray.800',
                  }}
                  color="gray.500"
                  rounded="md"
                >
                  Rp.
                </InputLeftAddon>
                <Field
                  as={Input}
                  type="number"
                  focusBorderColor="brand.400"
                  rounded="md"
                  onChange={handleChange}
                  value={values.bookPrice}
                  placeholder="ex. 125.000"
                  name="bookPrice"
                  id="bookPrice"
                />
              </InputGroup>
              <FormErrorMessage>{errors.bookPrice}</FormErrorMessage>
            </FormControl>
            <FormControl
              as={GridItem}
              colSpan={[3, 1]}
              isInvalid={!!errors.bookWeight && touched.bookWeight}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
              >
                Weight
              </FormLabel>
              <InputGroup size="sm">
                <Field
                  as={Input}
                  type="number"
                  focusBorderColor="brand.400"
                  rounded="md"
                  placeholder="ex. 64"
                  value={values.bookWeight}
                  name="bookWeight"
                  id="bookWeight"
                  onChange={handleChange}
                />
                <InputRightAddon
                  bg="gray.50"
                  _dark={{
                    bg: 'gray.800',
                  }}
                  color="gray.500"
                  rounded="md"
                >
                  gram
                </InputRightAddon>
              </InputGroup>
              <FormErrorMessage>{errors.bookWeight}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={!!errors.file}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              Image photo
            </FormLabel>
            <Flex
              mt={1}
              justify="center"
              px={6}
              pt={5}
              pb={6}
              borderWidth={2}
              _dark={{
                color: 'gray.500',
              }}
              borderStyle="dashed"
              rounded="md"
            >
              <Stack spacing={1} textAlign="center">
                <HStack flexFlow={'wrap'} justifyContent={'center'}>
                  {preview?.length > 0 ? (
                    preview.map((el, idx) => (
                      <Stack key={idx}>
                        <Box border={idx + 1 === 1 ? 'red solid 4px' : ''}>
                          <Image
                            w={'240px'}
                            h={'135px'}
                            src={el?.source}
                            alt="book image(s)"
                          />
                        </Box>
                        <IconButton
                          aria-label="Delete image"
                          icon={<MdDeleteForever />}
                          colorScheme="orange"
                          variant={'outline'}
                          mt={3}
                          onClick={() => deleteImg(el)}
                        />
                      </Stack>
                    ))
                  ) : (
                    <Icon
                      mx="auto"
                      boxSize={12}
                      color="gray.400"
                      _dark={{
                        color: 'gray.500',
                      }}
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Icon>
                  )}
                </HStack>

                <Flex
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: 'gray.400',
                  }}
                  alignItems="baseline"
                  justifyContent={'center'}
                >
                  <chakra.label
                    htmlFor="file"
                    cursor="pointer"
                    rounded="md"
                    fontSize="md"
                    color="brand.600"
                    _dark={{
                      color: 'brand.200',
                    }}
                    pos="relative"
                    _hover={{
                      color: 'brand.400',
                      _dark: {
                        color: 'brand.300',
                      },
                    }}
                  >
                    <Text>Upload a file</Text>
                    <VisuallyHidden>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        onChange={uploadImg}
                      />
                    </VisuallyHidden>
                  </chakra.label>
                </Flex>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  _dark={{
                    color: 'gray.50',
                  }}
                >
                  PNG, JPG, JPEG, GIF up to 1MB
                </Text>
              </Stack>
            </Flex>
            <FormHelperText>
              <Text as={'span'} color={'red'} fontWeight={'bold'}>
                Red highlight
              </Text>{' '}
              image will be display as Primary Image
            </FormHelperText>
            <FormErrorMessage>{errors.file}</FormErrorMessage>
          </FormControl>
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
            color="black"
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
    </>
  );
}
