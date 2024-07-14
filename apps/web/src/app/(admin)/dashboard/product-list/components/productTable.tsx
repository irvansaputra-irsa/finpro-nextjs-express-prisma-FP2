import { IUser } from '@/context/Auth';
import { product } from '@/interface/product.interface';
import { parseCurrency, parseDateTime } from '@/utils/convert';
import { checkSuperAdmin } from '@/utils/indicator';
import {
  Box,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import {
  TiArrowUnsorted,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from 'react-icons/ti';
import DialogDelete from './dialogDelete';
import { useState } from 'react';
interface propsVal {
  user: IUser | null;
  productList: product[];
  handleDetailProduct: (bookName: string) => void;
  handleSort: (column: string) => void;
  sortColumn: string;
  order: 'ASC' | 'DESC' | 'UNSORT';
}

export default function ProductTable({
  user,
  productList,
  handleDetailProduct,
  handleSort,
  sortColumn,
  order,
}: propsVal) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idCurrent, setIdCurrent] = useState(0);
  const handleDeleteProduct = (id: number) => {
    onOpen();
    setIdCurrent(id);
  };
  const allowSort = (column: string) => {
    return (
      <Box cursor={'pointer'} onClick={() => handleSort(column)}>
        {sortColumn !== column || order === 'UNSORT' ? (
          <TiArrowUnsorted size={25} />
        ) : order === 'ASC' ? (
          <TiArrowSortedUp size={25} />
        ) : (
          <TiArrowSortedDown size={25} />
        )}
      </Box>
    );
  };
  return (
    <TableContainer>
      <Table
        layout={{ base: 'auto', '2xl': 'fixed' }}
        variant="simple"
        size={'lg'}
      >
        <Thead>
          <Tr>
            <Th fontSize={'lg'} fontWeight={'bold'}>
              <Flex justifyContent={'start'} gap={3} alignItems={'center'}>
                {allowSort('book_name')}
                <Box>Book Name</Box>
              </Flex>
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'}>
              Category
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'}>
              Author
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'} isNumeric>
              <Flex justifyContent={'end'} gap={3} alignItems={'center'}>
                {allowSort('book_price')}
                <Box>Price</Box>
              </Flex>
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'} isNumeric>
              <Flex justifyContent={'end'} gap={3} alignItems={'center'}>
                {allowSort('created_at')}
                <Box>Created At</Box>
              </Flex>
            </Th>
            {checkSuperAdmin(user) ? (
              <Th fontSize={'lg'} fontWeight={'bold'}>
                Action
              </Th>
            ) : (
              ''
            )}
          </Tr>
        </Thead>
        <Tbody>
          {productList.length ? (
            productList?.map(
              (
                {
                  id,
                  book_name,
                  book_price,
                  bookCategory,
                  book_author,
                  created_at,
                },
                idx: number,
              ) => (
                <Tr key={idx}>
                  <Td maxW={'300px'} overflow={'hidden'}>
                    {book_name}
                  </Td>
                  <Td>{bookCategory?.book_category_name}</Td>
                  <Td>{book_author}</Td>
                  <Td isNumeric> {parseCurrency(book_price)}</Td>
                  <Td isNumeric> {parseDateTime(created_at)}</Td>
                  {checkSuperAdmin(user) ? (
                    <Td>
                      <Flex justifyContent={'start'}>
                        <Icon
                          cursor={'pointer'}
                          as={FaEdit}
                          w={5}
                          h={5}
                          mr={3}
                          onClick={() => handleDetailProduct(book_name)}
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
                  ) : (
                    ''
                  )}
                </Tr>
              ),
            )
          ) : (
            <Tr>
              <Td textAlign={'center'} colSpan={100}>
                No data found
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <DialogDelete
        isOpenDialog={isOpen}
        onCloseDialog={onClose}
        currentIdModal={idCurrent}
      />
    </TableContainer>
  );
}
