'use client';
import { Box, Button, Heading, SimpleGrid, Spinner } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './component/card';
import { useGetAnotherProductOnWarehouse } from '@/hooks/useWarehouseStock';
import { product } from '@/interface/product.interface';
import { useRouter } from 'next/navigation';

import { IoArrowBackOutline } from 'react-icons/io5';

export default function ProductList() {
  const param = useSearchParams();
  const warehouseId = param.get('id');
  const router = useRouter();
  const { data, isLoading } = useGetAnotherProductOnWarehouse(
    Number(warehouseId) || 0,
  );
  const products: product[] = data?.data.data || [];

  if (isLoading) return <Spinner />;

  return (
    <Box p={5}>
      <Button
        leftIcon={<IoArrowBackOutline />}
        colorScheme="orange"
        onClick={() => router.back()}
        variant={'outline'}
      >
        Back to warehouse
      </Button>
      <Heading size={'2xl'} py={5}>
        Available to add
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
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
    </Box>
  );
}
