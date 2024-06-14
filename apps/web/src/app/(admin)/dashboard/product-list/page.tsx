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
} from '@chakra-ui/react';
import React from 'react';
import { useProductDashboard } from '@/hooks/useProduct';
import { product } from '@/interface/product.interface';
import { useProductDeleteMutation } from '@/hooks/useProductMutation';
import { useRouter } from 'next/navigation';
import { separateStringHyphen } from '@/app/utils/convert';
import Link from 'next/link';

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
      <Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productList.map(
                ({ id, book_name, book_price, bookCategory }, idx: number) => (
                  <Tr key={idx}>
                    <Td>{book_name}</Td>
                    <Td>{bookCategory?.book_category_name}</Td>
                    <Td isNumeric>{book_price}</Td>
                    <Td>
                      <Flex>
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
        <Flex mt={5} justifyContent={'end'}>
          <Link href={'/dashboard/product-form'}>
            <Button>Insert a new book product</Button>
          </Link>
        </Flex>
      </Box>
    );
  } else {
    return <Spinner />;
  }
}
