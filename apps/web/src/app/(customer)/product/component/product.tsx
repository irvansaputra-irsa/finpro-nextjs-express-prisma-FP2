import { product } from '@/interface/product.interface';
import {
  parseCurrency,
  returnImgURl,
  separateStringHyphen,
} from '@/utils/convert';
import { Box, Img, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type props = {
  products: product[];
};

export default function ProductCard({ products }: props) {
  const router = useRouter();
  const redirectPDP = (nav: string) => {
    router.push(`/product/${separateStringHyphen(nav)}`);
  };

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={10}>
      {products.map((el, idx) => (
        <Box
          onClick={() => {
            redirectPDP(el.book_name);
          }}
          key={idx}
          maxW="xs"
          mx="auto"
          bg="white"
          _dark={{
            bg: 'gray.800',
          }}
          shadow="lg"
          rounded="lg"
          cursor={'pointer'}
        >
          <Box px={4} py={2}>
            <Img
              h={48}
              w="250px"
              objectFit="cover"
              mt={2}
              src={returnImgURl(el.primary_image)}
              alt="product img"
            />
            <Text
              mt={1}
              fontSize="sm"
              color="gray.500"
              _dark={{
                color: 'gray.400',
              }}
            >
              {el.book_author}
            </Text>
            <Text
              color="gray.900"
              _dark={{
                color: 'white',
              }}
              fontSize="lg"
              noOfLines={2}
              minH={'55px'}
            >
              {el.book_name}
            </Text>
          </Box>

          <Box width={'full'} px={4} py={2} bg="gray.900" roundedBottom="lg">
            <Text color="white" fontWeight="bold" fontSize="lg">
              {parseCurrency(el.book_price)}
            </Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
}
