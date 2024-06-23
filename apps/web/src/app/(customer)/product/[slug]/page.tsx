'use client';
import { useProductDetailCustomer } from '@/hooks/useProduct';
import { product } from '@/interface/product.interface';
import { parseCurrency } from '@/utils/convert';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FaCartArrowDown } from 'react-icons/fa6';
import {
  Box,
  Button,
  Divider,
  Fade,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  useAddProductCartMutation,
  useCreateCartMutation,
} from '@/hooks/useCartMutation';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const idUser = 24;
  const { mutateAsync: createCart } = useCreateCartMutation();
  const bookName = params.slug || '';
  const [simpleDesc, setSimpleDesc] = useState<boolean>(true);
  const { data } = useProductDetailCustomer(bookName);
  const bookData: product = data?.data.data || undefined;
  const bookImage = bookData?.BookImage || [];
  const [mainImage, setMainImage] = useState<string>(bookImage[0]?.book_image);
  const [totalQty, setTotalQty] = useState<number>(0);
  useEffect(() => {
    if (bookImage?.length > 0) {
      setMainImage(bookImage[0]?.book_image);
    }
  }, [bookImage]);

  const handleToggleDesc = () => setSimpleDesc(!simpleDesc);
  const changePreviewImage = (img: string) => {
    setMainImage(img);
  };
  const handleSubTotal = (): string => {
    if (totalQty && bookData?.book_price) {
      const price = parseCurrency(totalQty * bookData?.book_price);
      return price;
    }
    return '0';
  };

  const { mutate: addToCart } = useAddProductCartMutation();
  const handleAddCart = async () => {
    try {
      await createCart(idUser);
      addToCart({
        userId: idUser,
        bookId: bookData.id,
        quantity: totalQty,
      });
    } catch (error) {}
  };

  return (
    <Box maxW={'1440px'} mx={'auto'} py={12} px={10}>
      <Flex>
        <Box mr={5}>
          <Box width={'403px'}>
            <Image
              maxW={'full'}
              h={'270px'}
              objectFit={'contain'}
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/products/${mainImage}`}
            ></Image>
          </Box>
          <Box width={'353px'} mt={3}>
            <SimpleGrid columns={3} spacing={4}>
              {bookImage.map((el) => (
                <Box
                  width={'120px'}
                  onClick={() => changePreviewImage(el.book_image)}
                  cursor={'pointer'}
                  key={el?.id}
                >
                  <Image
                    maxW={'full'}
                    h={'70px'}
                    objectFit={'fill'}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/products/${el.book_image}`}
                  ></Image>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
        <Box mr={10}>
          <Text fontSize={'sm'}>{bookData?.book_author}</Text>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            {bookData?.book_name}
          </Text>
          <Text color={'orange'} fontSize={'lg'}>
            {parseCurrency(bookData?.book_price)}
          </Text>
          <Box mt={5}>
            <Heading size={'md'} mb={3}>
              Deskripsi Buku
            </Heading>
            <Text textAlign={'justify'} noOfLines={simpleDesc ? 4 : undefined}>
              {bookData?.book_description}
            </Text>
            <Flex justifyContent={'end'} cursor={'pointer'}>
              {simpleDesc ? (
                <Text onClick={handleToggleDesc} as={'b'}>
                  Read more
                </Text>
              ) : (
                <Text onClick={handleToggleDesc} as={'b'}>
                  Concise Description
                </Text>
              )}
            </Flex>
          </Box>
          <Box mb={5}>
            <Heading mb={3} size={'md'}>
              Detail
            </Heading>
            <SimpleGrid columns={2} spacing={5}>
              <Box height={'40px'}>
                <Text fontSize={'md'} color={'gray.600'}>
                  Publisher
                </Text>
                <Text fontSize={'md'}>{bookData?.book_publisher}</Text>
              </Box>
              <Box height={'40px'}>
                <Text fontSize={'md'} color={'gray.600'}>
                  Published Date
                </Text>
                <Text fontSize={'md'}>{bookData?.book_published_year}</Text>
              </Box>
              <Box height={'40px'}>
                <Text fontSize={'md'} color={'gray.600'}>
                  ISBN
                </Text>
                <Text fontSize={'md'}>{bookData?.book_ISBN}</Text>
              </Box>
              <Box height={'40px'}>
                <Text fontSize={'md'} color={'gray.600'}>
                  Weight
                </Text>
                <Text fontSize={'md'}>{bookData?.book_weight} gram</Text>
              </Box>
              <Box height={'40px'}>
                <Text fontSize={'md'} color={'gray.600'}>
                  Category
                </Text>
                <Text fontSize={'md'}>
                  {bookData?.bookCategory?.book_category_name}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
        <Box w={'250px'}>
          <Stack>
            <Text fontSize={'lg'} color={'gray.600'} fontWeight={'bold'}>
              Buy product
            </Text>
            <Text fontSize={'sm'} fontWeight={'semibold'}>
              Total product
            </Text>
            <Flex w={'50%'} justifyContent={'space-between'}>
              <Box
                mt={1}
                cursor={'pointer'}
                onClick={() => totalQty && setTotalQty((prev) => prev - 1)}
              >
                <Icon
                  bg={'orange'}
                  color={'white'}
                  w={'18px'}
                  h={'18px'}
                  borderRadius={'10px'}
                  as={FaMinus}
                />
              </Box>
              <Box>
                <Text fontSize={'lg'}>{totalQty}</Text>
              </Box>
              <Box
                mt={1}
                cursor={'pointer'}
                onClick={() => setTotalQty((prev) => prev + 1)}
              >
                <Icon
                  bg={'orange'}
                  color={'white'}
                  as={FaPlus}
                  w={'18px'}
                  h={'18px'}
                  borderRadius={'10px'}
                />
              </Box>
            </Flex>
            <Divider />
            <Flex justifyContent={'space-between'}>
              <Text fontSize={'md'} color={'gray.600'} fontWeight={'bold'}>
                Subtotal
              </Text>
              <Text>{handleSubTotal()}</Text>
            </Flex>
            <Box mt={3}>
              <Button
                colorScheme={'orange'}
                leftIcon={<FaCartArrowDown color="orange" />}
                rounded={'18px'}
                variant={'outline'}
                onClick={handleAddCart}
                isDisabled={totalQty <= 0}
              >
                Add to cart
              </Button>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
