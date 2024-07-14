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
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
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
import { AuthContext } from '@/context/Auth';
import { checkSuperAdmin } from '@/utils/indicator';

export default function ProductList() {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const params = new URLSearchParams(searchParams);
  const pageQuery = params.get('page') || 1;
  const searchQuery = params.get('search') || '';
  const sortQuery = params.get('sort') || '';
  const [page, setPage] = useState<number>(Number(pageQuery));
  // const [sort, setSort] = useState<string>(sortQuery);
  const [search, setSearch] = useState<string>(searchQuery);
  const [debounceSearch] = useDebounce(search.trim(), 1000);
  const [sortColumn, setSortColumn] = useState('');
  const [orderBy, setOrderBy] = useState<'ASC' | 'DESC' | 'UNSORT'>('UNSORT');

  const handleSort = (column: string) => {
    if (column) {
      setSortColumn(column);
      if (orderBy === 'UNSORT') {
        setOrderBy('ASC');
      } else if (orderBy === 'ASC') setOrderBy('DESC');
      else setOrderBy('UNSORT');

      // setOrderBy((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    }
  };

  const limit = 10;
  const { data, isPlaceholderData, isLoading } = useProductListDashboard(
    page,
    limit,
    debounceSearch,
    sortColumn,
    orderBy,
  );
  const { replace, push } = useRouter();
  const productList: product[] = data?.data?.data?.data || [];
  const totalPages = data?.data.data.totalPages;

  const handleClickButton = (type: string): void => {
    if (type === 'next') {
      setPage((old: number) => old + 1);
    }
    if (type === 'prev') {
      setPage((old: number) => Math.max(old - 1, 1));
    }
  };

  useEffect(() => {
    if (page) {
      setQueryUrl(queryParams, pathname, replace, 'page', page.toString());
    }
  }, [page]);

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
        <Flex
          flexDirection={{ base: 'column', '2xl': 'row' }}
          justifyContent={'space-between'}
        >
          <Box>
            <Heading size={'2xl'} color={'black'} px={5} py={10}>
              Book List
            </Heading>
          </Box>
          <Flex
            gap={6}
            alignItems={'center'}
            flexDirection={{ base: 'column', '2xl': 'row' }}
          >
            <InputGroup>
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
            {checkSuperAdmin(user) ? (
              <Button
                width={{ base: 'full', '2xl': '250px' }}
                colorScheme="orange"
                variant={'outline'}
                onClick={() => push('/dashboard/product-form')}
              >
                Create a new book
              </Button>
            ) : (
              ''
            )}
          </Flex>
        </Flex>
        <ProductTable
          user={user}
          handleDetailProduct={handleDetailProduct}
          handleSort={handleSort}
          productList={productList}
          sortColumn={sortColumn}
          order={orderBy}
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
