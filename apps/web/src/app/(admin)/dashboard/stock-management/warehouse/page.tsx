'use client';
import { useGetWarehouseStock } from '@/hooks/useWarehouseStock';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FormEvent, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAddStockMutation } from '@/hooks/useWarehouseStockMutation';
import { parseCurrency, parseDateTime } from '@/utils/convert';
import { Link } from '@chakra-ui/next-js';
import { useSearchParams } from 'next/navigation';
export default function WarehouseStock() {
  const param = useSearchParams();
  const warehouseId = param.get('id') || 0;
  const { data: listWarehouseStock, isLoading } = useGetWarehouseStock(
    Number(warehouseId),
  );
  const productList = listWarehouseStock?.data.data || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentIdModal, setCurrentIdModal] = useState<number>(0);
  const [input, setInput] = useState<number>(0);
  const { mutate: mutateAddStock } = useAddStockMutation();
  const initialRef = useRef(null);
  const openModal = (id: number) => {
    setCurrentIdModal(id);
    onOpen();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutateAddStock({ id: currentIdModal, stockAddition: input });
    onClose();
  };
  if (!isLoading) {
    return (
      <Box w={{ base: '100%', xl: '60%' }}>
        <Flex justifyContent={'space-between'}>
          <Heading p={5}>Book stock at warehouse</Heading>
          <Link
            alignSelf={'center'}
            href={`/dashboard/stock-management/warehouse/product?id=${warehouseId}`}
          >
            <Button colorScheme="orange">Add product</Button>
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
                <Th>Action</Th>
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
                      <Icon
                        as={FaPlus}
                        cursor={'pointer'}
                        w={7}
                        onClick={() => {
                          openModal(el.id);
                        }}
                      />
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

        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add stock</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    min={1}
                    name="stockAdd"
                    id="stockAdd"
                    onChange={(e) => setInput(Number(e.target.value))}
                    ref={initialRef}
                  />
                  <FormHelperText color={'black.600'}>
                    Please input it correctly.
                  </FormHelperText>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant={'ghost'}
                  colorScheme="white"
                  mr={3}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button type="submit" colorScheme="orange">
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </Box>
    );
  } else return <Spinner />;
}
