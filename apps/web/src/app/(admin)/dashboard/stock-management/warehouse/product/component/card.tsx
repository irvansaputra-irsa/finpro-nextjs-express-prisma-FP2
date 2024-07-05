import Dialog from '@/components/dialog/Dialog';
import { useAddProductWarehouseMutation } from '@/hooks/useWarehouseStockMutation';
import { product } from '@/interface/product.interface';
import {
  Box,
  Button,
  Flex,
  Image,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

interface ProductCardProps {
  product: product;
  warehouseId: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, warehouseId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imgUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/products/${product?.primary_image}`;
  const { mutate } = useAddProductWarehouseMutation();

  const handleSubmit = (): void => {
    mutate({ bookId: product.id, warehouseId });
    onClose();
  };
  return (
    <Box
      w="100%"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      mx="auto"
    >
      <Image w="full" h={56} fit="cover" src={imgUrl} alt="avatar" />

      <Stack py={5} textAlign="center">
        <Flex
          display="block"
          fontSize="2xl"
          color="gray.800"
          _dark={{
            color: 'white',
          }}
          fontWeight="bold"
        >
          {product.book_name}
        </Flex>
        <Text
          fontSize="sm"
          color="gray.700"
          _dark={{
            color: 'gray.200',
          }}
        >
          {product.bookCategory?.book_category_name}
        </Text>
        <Button
          mx="auto"
          variant={'outline'}
          colorScheme="orange"
          w={'80%'}
          onClick={() => onOpen()}
        >
          Add book
        </Button>
      </Stack>
      <Dialog
        text="Are you sure you want to add this book to the warehouse?"
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        onClose={onClose}
        color="red"
      />
    </Box>
  );
};

export default ProductCard;
