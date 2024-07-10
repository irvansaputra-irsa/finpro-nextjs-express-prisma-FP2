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
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useAddProductCartMutation } from '@/hooks/useCartMutation';
import { useGetUserCart } from '@/hooks/useCart';
import { AuthContext } from '@/context/Auth';
import { useRouter } from 'next/navigation';

type cartItems = {
  book_id: number;
  cart_id: number;
  id: number;
  quantity: number;
  total_price: number;
  total_weight: number;
  updated_at: Date;
  created_at: Date;
};
export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { data: carts } = useGetUserCart(user?.id || 0);
  const bookName = params.slug || '';
  const [simpleDesc, setSimpleDesc] = useState<boolean>(true);
  const { data: books } = useProductDetailCustomer(bookName);
  const bookData: product = books?.data.data || undefined;
  const bookImage = bookData?.BookImage || [];
  const bookStock = bookData?.current_stock || 0;
  const [mainImage, setMainImage] = useState<string>(bookImage[0]?.book_image);
  const [totalQty, setTotalQty] = useState<number>(0);
  useEffect(() => {
    if (books?.data?.data?.BookImage && books.data.data.BookImage.length > 0) {
      setMainImage(books?.data?.data?.BookImage[0]?.book_image);
    }
  }, [books]);

  useEffect(() => {
    if (carts && bookData) {
      const item = carts?.data.cartId.CartItem.find(
        (el: cartItems) => bookData?.id === el?.book_id,
      );
      if (item) setTotalQty(item?.quantity);
    }
  }, [carts, bookData]);

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
  const handleAddCart = () => {
    if (user?.id) {
      addToCart({
        userId: user?.id,
        bookId: bookData.id,
        quantity: totalQty,
      });
    } else router.push('/login');
  };
  return (
    <Box
      maxW={'1440px'}
      minH={'60vh'}
      mx={'auto'}
      py={12}
      px={10}
      bgColor={'#F7F9F2'}
    >
      <Flex
        gap={10}
        alignItems={'center'}
        direction={{ base: 'column', lg: 'row' }}
      >
        <Box>
          <Box width={'403px'}>
            <Image
              alt="primary book image(s)"
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
                    alt="book image(s)"
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
        <Box w={{ base: 'full', md: 500 }}>
          <Text fontSize={'sm'}>{bookData?.book_author}</Text>
          <Text fontSize={'xl'} fontWeight={'bold'}>
            {bookData?.book_name}
          </Text>
          <Text color={'orange'} fontSize={'lg'}>
            {parseCurrency(bookData?.book_price)}
          </Text>
          <Box mt={5}>
            <Heading size={'md'} mb={3}>
              Book Description
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
            <SimpleGrid columns={[1, 2]} gap={[5, 15, 10]}>
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
        <Box
          w={{ base: 'full', md: '50%', lg: '300px' }}
          bgColor={'#F7DCB9'}
          px={10}
          py={5}
          borderRadius={20}
          boxShadow={
            'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
          }
        >
          <Stack>
            <Text fontSize={'lg'} color={'gray.600'} fontWeight={'bold'}>
              Buy product
            </Text>
            <Text fontSize={'sm'} fontWeight={'semibold'}>
              Total product
            </Text>
            <Flex w={'80%'} justifyContent={'space-between'}>
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
                onClick={() =>
                  totalQty < bookStock && setTotalQty((prev) => prev + 1)
                }
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
              <Box>
                <Text as={'i'}>stock: {bookData?.current_stock || 0}</Text>
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
                rounded={'17px'}
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
