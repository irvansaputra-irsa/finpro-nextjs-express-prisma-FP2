import { displayStatusIndicator } from '@/utils/indicator';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import ButtonAccept from './buttonAccept';
import ButtonReject from './buttonReject';
import ButtonDetail from './buttonDetail';
import { AuthContext } from '@/context/Auth';
import { Imutation } from '@/interface/mutation.interface';

type props = {
  incomingMutation: Imutation[];
};
export default function TableIncoming({ incomingMutation }: props) {
  const { user } = useContext(AuthContext);
  return (
    <Table variant="striped" colorScheme="teal">
      <Thead>
        <Tr>
          <Th>Request from (warehouse)</Th>
          <Th>Book Name</Th>
          <Th>Status</Th>
          <Th isNumeric>Quantity</Th>
          <Th textAlign={'center'}>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {incomingMutation?.length ? (
          incomingMutation?.map((el) => (
            <Tr key={el.id}>
              <Td>{el.from_warehouse?.warehouse_name}</Td>
              <Td whiteSpace={'pre-wrap'} width={'25%'}>
                {el.book.book_name}
              </Td>
              <Td color={displayStatusIndicator(el.status)} fontWeight={'bold'}>
                {el.status}
              </Td>
              <Td isNumeric>{el.quantity}</Td>
              <Td textAlign={'center'}>
                {el.status === 'PROCESSED' ? (
                  <>
                    <ButtonAccept id={el.id} userName={user?.userName || ''} />
                    <ButtonReject id={el.id} userName={user?.userName || ''} />
                    <ButtonDetail
                      senderName={el.sender_name}
                      senderNotes={el.sender_notes}
                    />
                  </>
                ) : (
                  ''
                )}
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5} textAlign={'center'}>
              No data available
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
}
