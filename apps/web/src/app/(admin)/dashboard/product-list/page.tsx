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
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useProductListDashboard } from '@/hooks/useProduct';
import { product } from '@/interface/product.interface';
import { useProductDeleteMutation } from '@/hooks/useProductMutation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { separateStringHyphen } from '@/utils/convert';
import { Link } from '@chakra-ui/next-js';
import Paginate from '@/components/pagination/paginate';
import { useDebounce } from 'use-debounce';
import { CiSearch } from 'react-icons/ci';
import { setQueryUrl } from '@/utils/queryParam';
import ProductTable from './components/productTable';

export default function ProductList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const params = new URLSearchParams(searchParams);
  const pageQuery = params.get('page') || 1;
  const searchQuery = params.get('search') || '';
  const sortQuery = params.get('sort') || '';
  const [page, setPage] = useState<number>(Number(pageQuery));
  const [sort, setSort] = useState<string>(sortQuery);
  const [search, setSearch] = useState<string>(searchQuery);
  const [debounceSearch] = useDebounce(search.trim(), 1000);
  const limit = 10;
  const { data, isPlaceholderData, isLoading } = useProductListDashboard(
    page,
    limit,
    sort,
    debounceSearch,
  );
  const { mutate: mutateDelete } = useProductDeleteMutation();
  const { replace, push } = useRouter();
  const productList: product[] = data?.data?.data?.data || [];
  const totalPages = data?.data.data.totalPages;

  const handleDeleteProduct = (id: number) => {
    mutateDelete(id);
  };

  const handleClickButton = (type: string): void => {
    if (type === 'next') {
      setPage((old: number) => old + 1);
      setQueryUrl(
        queryParams,
        pathname,
        replace,
        'page',
        (page + 1).toString(),
      );
    }
    if (type === 'prev') {
      setPage((old: number) => Math.max(old - 1, 1));
      setQueryUrl(
        queryParams,
        pathname,
        replace,
        'page',
        (page - 1).toString(),
      );
    }
  };

  useEffect(() => {
    if (!debounceSearch) {
      queryParams.delete('search');
      replace(`${pathname}?${queryParams.toString()}`, {
        scroll: false,
      });
    } else {
      setQueryUrl(queryParams, pathname, replace, 'search', debounceSearch);
    }
  }, [debounceSearch]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const currentSearch = e.target.value;
    setSearch(currentSearch);
    setPage(1);
  };

  const handleDetailProduct = (bookName: string) => {
    push(
      `/dashboard/product-form?product_name=${separateStringHyphen(bookName)}`,
    );
  };

  if (!isLoading) {
    return (
      <Box mx="auto">
        <Flex justifyContent={'space-between'}>
          <Box>
            <Heading color={'orange'} fontSize={'4xl'} p={5}>
              Book List
            </Heading>
          </Box>
          <Flex>
            <InputGroup my={'auto'} mr={5}>
              <InputRightElement pointerEvents="none">
                <CiSearch color="gray.300" />
              </InputRightElement>
              <Input
                id="searchs"
                type="text"
                placeholder="Search"
                onChange={(e) => handleSearch(e)}
                value={search}
              />
            </InputGroup>
            <Link alignSelf={'center'} href={'/dashboard/product-form'}>
              <Button colorScheme="orange" variant={'outline'}>
                Insert a new book product
              </Button>
            </Link>
          </Flex>
        </Flex>
        <ProductTable
          handleDeleteProduct={handleDeleteProduct}
          handleDetailProduct={handleDetailProduct}
          productList={productList}
        />
        <Flex mt={5} justifyContent={'end'}></Flex>
        <Paginate
          isPlaceholderData={isPlaceholderData}
          page={page}
          totalPages={totalPages}
          handleClickButton={handleClickButton}
        />
      </Box>
    );
  } else {
    return <Spinner />;
  }
}
