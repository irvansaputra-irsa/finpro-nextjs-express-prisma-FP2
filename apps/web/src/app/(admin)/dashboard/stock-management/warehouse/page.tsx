'use client';
import { useGetWarehouseStock } from '@/hooks/useWarehouseStock';
import {
  Box,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
export default function WarehouseStock() {
  // const param = useSearchParams();
  const warehouseId = 1;
  const { data: listWarehouseStock } = useGetWarehouseStock(
    Number(warehouseId),
  );
  const productList = listWarehouseStock?.data.data || [];
  return (
    <Box>
      <Heading>Warehouse Product {warehouseId}</Heading>
      <TableContainer w={{ base: '100%', xl: '50%' }}>
        <Table variant="simple">
          {/* <TableCaption>
            All data based on warehouse {warehouseId} stock
          </TableCaption> */}
          <Thead>
            <Tr>
              <Th>Book Name</Th>
              <Th>Category</Th>
              <Th isNumeric>Price</Th>
              <Th>Stock Quantity</Th>
              <Th>Last updated</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productList.map((el: any, idx: number) => (
              <Tr key={idx}>
                <Td>{el?.book?.book_name}</Td>
                <Td>{el?.book?.bookCategory?.book_category_name}</Td>
                <Td isNumeric>{el?.book?.book_price}</Td>
                <Td>{el?.stockQty}</Td>
                <Td>{el?.updated_at}</Td>
                <Td>
                  <Icon as={FaPlus} cursor={'pointer'} w={7} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
