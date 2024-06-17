'use client';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import {
  Button,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Spinner,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import { useProductDashboard } from '@/hooks/useProduct';
import { product } from '@/interface/product.interface';
import { useProductDeleteMutation } from '@/hooks/useProductMutation';
import { useRouter } from 'next/navigation';
import { parseCurrency, separateStringHyphen } from '@/utils/convert';
import { Link } from '@chakra-ui/next-js';

export default function ProductList() {
  const { data, isLoading } = useProductDashboard();
  const { mutate: mutateDelete } = useProductDeleteMutation();
  const router = useRouter();
  const productList: product[] = data?.data?.data || [];

  const handleDeleteProduct = (id: number) => {
    mutateDelete(id);
  };

  if (!isLoading) {
    return (
      <Box w={{ base: '100%', xl: '70%' }}>
        <Flex justifyContent={'space-between'}>
          <Heading p={5}>Product List</Heading>
          <Link alignSelf={'center'} href={'/dashboard/product-form'}>
            <Button>Insert a new book product</Button>
          </Link>
        </Flex>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productList.length &&
                productList?.map(
                  (
                    { id, book_name, book_price, bookCategory },
                    idx: number,
                  ) => (
                    <Tr key={idx}>
                      <Td>{book_name}</Td>
                      <Td>{bookCategory?.book_category_name}</Td>
                      <Td isNumeric> {parseCurrency(book_price)}</Td>
                      <Td isNumeric>
                        <Flex justifyContent={'end'}>
                          <Icon
                            cursor={'pointer'}
                            as={FaEdit}
                            w={5}
                            h={5}
                            mr={3}
                            onClick={() =>
                              router.push(
                                `/dashboard/product-form?product_name=${separateStringHyphen(book_name)}`,
                              )
                            }
                          />
                          <Icon
                            cursor={'pointer'}
                            as={MdDelete}
                            w={5}
                            h={5}
                            onClick={() => handleDeleteProduct(id)}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ),
                )}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex mt={5} justifyContent={'end'}></Flex>
      </Box>
    );
  } else {
    return <Spinner />;
  }
}
