'use client';
import { useGetWarehouseStock } from '@/hooks/useWarehouseStock';
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FormEvent, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  useAddStockMutation,
  useRemoveStockMutation,
} from '@/hooks/useWarehouseStockMutation';
import { parseCurrency, parseDateTime } from '@/utils/convert';
import { Link } from '@chakra-ui/next-js';
import { useSearchParams } from 'next/navigation';
import { MdDelete } from 'react-icons/md';
import ModalStock from './component/modalAdd';
export default function WarehouseStock() {
  const param = useSearchParams();
  const warehouseId = param.get('id') || 0;
  const { data: listWarehouseStock, isLoading } = useGetWarehouseStock(
    Number(warehouseId),
  );
  const productList = listWarehouseStock?.data.data || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();
  const [currentIdModal, setCurrentIdModal] = useState<number>(0);
  const { mutate: mutateAddStock } = useAddStockMutation();
  const { mutate: mutateRemoveStock } = useRemoveStockMutation();
  const initialRef = useRef<HTMLInputElement>(null);
  const initialRefRemove = useRef<HTMLInputElement>(null);
  const openModal = (id: number, remove: boolean = false) => {
    setCurrentIdModal(id);
    if (remove) {
      onOpenRemove();
    } else onOpen();
  };

  const handleRemove = (e: FormEvent) => {
    e.preventDefault();
    mutateRemoveStock(
      {
        id: currentIdModal,
        stockSubtraction: initialRefRemove.current?.value
          ? Number(initialRefRemove.current.value)
          : 0,
      },
      { onSuccess: () => onCloseRemove() },
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutateAddStock(
      {
        id: currentIdModal,
        stockAddition: initialRef.current?.value
          ? Number(initialRef.current.value)
          : 0,
      },
      { onSuccess: () => onClose() },
    );
  };

  if (!isLoading) {
    return (
      <Box
        bg={'#FDFFE2'}
        p={20}
        borderRadius={20}
        mx="auto"
        w={{ base: '100%', xl: '75%' }}
      >
        <Flex justifyContent={'space-between'} py={12}>
          <Heading size={'2xl'}>Book stock at warehouse</Heading>
          <Link
            alignSelf={'center'}
            href={`/dashboard/stock-management/warehouse/product?id=${warehouseId}`}
          >
            <Button colorScheme="orange" w={'200px'}>
              Add product
            </Button>
          </Link>
        </Flex>
        <TableContainer mt={5}>
          <Table variant="simple">
            <TableCaption>All data based on warehouse stock</TableCaption>
            <Thead>
              <Tr>
                <Th>Book Name</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th>Stock Quantity</Th>
                <Th>Last updated</Th>
                <Th textAlign={'center'}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productList.length ? (
                productList.map((el: any, idx: number) => (
                  <Tr key={idx}>
                    <Td>{el?.book?.book_name}</Td>
                    <Td>{el?.book?.bookCategory?.book_category_name}</Td>
                    <Td isNumeric> {parseCurrency(el?.book?.book_price)}</Td>
                    <Td>{el?.stockQty}</Td>
                    <Td>{parseDateTime(el?.updated_at)}</Td>
                    <Td>
                      <Flex gap={5}>
                        <FaPlus
                          cursor={'pointer'}
                          onClick={() => {
                            openModal(el.id);
                          }}
                          size={23}
                        />
                        <MdDelete
                          cursor={'pointer'}
                          size={25}
                          onClick={() => {
                            openModal(el.id, true);
                          }}
                        />
                      </Flex>
                    </Td>
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
        <ModalStock
          isOpen={isOpen}
          onClose={onClose}
          initialRef={initialRef}
          handleSubmit={handleSubmit}
          isDelete={false}
        />
        <ModalStock
          isOpen={isOpenRemove}
          onClose={onCloseRemove}
          initialRef={initialRefRemove}
          handleSubmit={handleRemove}
          isDelete={true}
        />
      </Box>
    );
  } else return <Spinner />;
}
