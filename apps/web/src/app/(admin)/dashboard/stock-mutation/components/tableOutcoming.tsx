import { displayStatusIndicator } from '@/utils/indicator';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import ButtonCancel from './buttonCancel';
import ButtonDetail from './buttonDetail';
import { Imutation } from '@/interface/mutation.interface';
type props = {
  outcomingMutation: Imutation[];
};
export default function TableOutcoming({ outcomingMutation }: props) {
  return (
    <Table variant="striped" colorScheme="teal">
      <Thead>
        <Tr>
          <Th>Request to (warehouse)</Th>
          <Th>Book Name</Th>
          <Th>Status</Th>
          <Th isNumeric>Quantity</Th>
          <Th textAlign={'center'}>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {outcomingMutation?.length ? (
          outcomingMutation?.map((el) => (
            <Tr key={el.id}>
              <Td>{el.to_warehouse?.warehouse_name}</Td>
              <Td whiteSpace={'pre-wrap'} width={'25%'}>
                {el.book.book_name}
              </Td>
              <Td fontWeight={'bold'} color={displayStatusIndicator(el.status)}>
                {el.status}
              </Td>
              <Td isNumeric>{el.quantity}</Td>
              <Td textAlign={'center'}>
                {el.status === 'PROCESSED' ? (
                  <ButtonCancel id={el.id} />
                ) : (
                  el.status !== 'CANCELED' && (
                    <ButtonDetail
                      senderName={el.sender_name}
                      senderNotes={el.sender_notes}
                      receiverName={el.receiver_name}
                      receiverNote={el.receiver_notes}
                    />
                  )
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
