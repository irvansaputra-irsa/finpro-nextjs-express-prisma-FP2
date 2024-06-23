import { product } from '@/interface/product.interface';
import { parseCurrency, parseDateTime } from '@/utils/convert';
import {
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

interface propsVal {
  productList: product[];
  handleDetailProduct: (bookName: string) => void;
  handleDeleteProduct: (id: number) => void;
}

export default function ProductTable({
  productList,
  handleDetailProduct,
  handleDeleteProduct,
}: propsVal) {
  return (
    <TableContainer>
      <Table variant="simple" size={'lg'}>
        <Thead>
          <Tr>
            <Th fontSize={'lg'} fontWeight={'bold'}>
              Name
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'}>
              Category
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'}>
              Author
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'} isNumeric>
              Price
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'} isNumeric>
              Created Date
            </Th>
            <Th fontSize={'lg'} fontWeight={'bold'} isNumeric>
              Action
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {productList.length
            ? productList?.map(
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
                    <Td isNumeric>
                      <Flex justifyContent={'end'}>
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
                  </Tr>
                ),
              )
            : null}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
