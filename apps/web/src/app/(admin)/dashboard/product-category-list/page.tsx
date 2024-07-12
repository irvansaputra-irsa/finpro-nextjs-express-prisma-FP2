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
import React, { useContext } from 'react';
import { useProductCategory } from '@/hooks/useProduct';
import { productCategory } from '@/interface/product.interface';
import { useCategoryProductDeleteMutation } from '@/hooks/useProductMutation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/Auth';
import { checkSuperAdmin } from '@/utils/indicator';

export default function ProductCategoryList() {
  const { user } = useContext(AuthContext);
  const { data, isLoading } = useProductCategory();
  const router = useRouter();
  const { mutate: mutateDelete } = useCategoryProductDeleteMutation();
  const categoryList: productCategory[] = data?.data?.data || '';

  const handleDeleteProduct = (id: number) => {
    mutateDelete(id);
  };
  if (!isLoading) {
    return (
      <Box width={{ '2xl': checkSuperAdmin(user) ? '50vw' : '30vw' }}>
        <Heading size={'2xl'} py={10} px={5}>
          Book Category List
        </Heading>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr w={'20%'}>
                <Th fontSize={'lg'}>Category Name</Th>
                {checkSuperAdmin(user) ? <Th fontSize={'lg'}>Action</Th> : ''}
              </Tr>
            </Thead>
            <Tbody>
              {categoryList.length ? (
                categoryList?.map((el: productCategory, idx) => (
                  <Tr key={idx}>
                    <Td>{el.book_category_name}</Td>
                    {checkSuperAdmin(user) ? (
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
                    ) : (
                      ''
                    )}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td textAlign={'center'} colSpan={100}>
                    No data found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        {checkSuperAdmin(user) ? (
          <Flex mt={5} justifyContent={'end'}>
            <Button
              w={{ base: 'full', '2xl': 'fit-content' }}
              onClick={() => router.push('/dashboard/product-category-form')}
              variant={'outline'}
              colorScheme="orange"
            >
              Create a new category
            </Button>
          </Flex>
        ) : (
          ''
        )}
      </Box>
    );
  } else {
    return <Spinner />;
  }
}
