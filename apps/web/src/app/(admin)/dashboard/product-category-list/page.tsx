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
import { useProductCategory } from '@/hooks/useProduct';
import { productCategory } from '@/interface/product.interface';
import { useCategoryProductDeleteMutation } from '@/hooks/useProductMutation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductCategoryList() {
  const { data, isLoading } = useProductCategory();
  const router = useRouter();
  const { mutate: mutateDelete } = useCategoryProductDeleteMutation();
  const categoryList: productCategory[] = data?.data?.data || '';

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
                <Th>Category Name</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categoryList.length &&
                categoryList?.map((el: productCategory, idx) => (
                  <Tr key={idx}>
                    <Td>{el.book_category_name}</Td>
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
                              `/dashboard/product-category-form?category_id=${el.id}`,
                            )
                          }
                        />
                        <Icon
                          cursor={'pointer'}
                          as={MdDelete}
                          w={5}
                          h={5}
                          onClick={() => handleDeleteProduct(el.id)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex mt={5} justifyContent={'end'}>
          <Link href={'/dashboard/product-category-form'}>
            <Button>Insert a new book category</Button>
          </Link>
        </Flex>
      </Box>
    );
  } else {
    return <Spinner />;
  }
}
