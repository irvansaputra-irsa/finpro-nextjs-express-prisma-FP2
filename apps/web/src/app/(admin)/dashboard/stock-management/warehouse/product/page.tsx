'use client';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './component/card';
import { useGetAnotherProductOnWarehouse } from '@/hooks/useWarehouseStock';
import { product } from '@/interface/product.interface';
import { useRouter } from 'next/navigation';

import { IoArrowBackOutline } from 'react-icons/io5';
import { useState } from 'react';
import Paginate from '@/components/pagination/paginate';
import { useDebounce } from 'use-debounce';
import { SearchIcon } from '@chakra-ui/icons';

export default function ProductList() {
  const router = useRouter();
  const param = useSearchParams();
  const warehouseId = param.get('id');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debounceSearch] = useDebounce(search, 800);
  const { data, isLoading, isPlaceholderData } =
    useGetAnotherProductOnWarehouse(
      Number(warehouseId) || 0,
      page,
      debounceSearch,
    );
  const totalPage = data?.data.data.totalPage || 0;
  const products = data?.data.data.products || [];

  const handlePaginate = (type: string): void => {
    if (type === 'next') {
      setPage((old: number) => old + 1);
    }
    if (type === 'prev') {
      setPage((old: number) => Math.max(old - 1, 1));
    }
  };

  if (isLoading) return <Spinner />;
  return (
    <Box p={5}>
      <Flex
        flexDirection={{ base: 'column', '2xl': 'row' }}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={5}
      >
        <Button
          alignSelf={'start'}
          leftIcon={<IoArrowBackOutline />}
          colorScheme="orange"
          onClick={() => router.back()}
          variant={'outline'}
        >
          Back to warehouse
        </Button>
        <Box bgColor={'#EADBC8'} px={10} borderRadius={'20px'}>
          <Heading
            color={'orange.400'}
            size={'2xl'}
            py={5}
            textAlign={'center'}
          >
            Product available to add
          </Heading>
        </Box>
      </Flex>
      <Flex justifyContent={'end'} my={10}>
        <InputGroup w={'300px'}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search book name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <SimpleGrid columns={4} spacing={10} my={10}>
        {products.length > 0 ? (
          products.map((product: product, idx: number) => (
            <ProductCard
              key={product.id}
              product={product}
              warehouseId={Number(warehouseId)}
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </SimpleGrid>
      <Paginate
        totalPages={totalPage}
        handleClickButton={handlePaginate}
        page={page}
        isPlaceholderData={isPlaceholderData}
      />
    </Box>
  );
}
