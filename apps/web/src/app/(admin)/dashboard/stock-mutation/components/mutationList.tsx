import { Box, Heading, Select, TableContainer } from '@chakra-ui/react';
import Paginate from '@/components/pagination/paginate';
import { useListWarehouse } from '@/hooks/useWarehouse';
import { listWarehouseInterface } from '@/interface/warehouse.interface';
import { useState } from 'react';
import { useGetWarehouseMutation } from '@/hooks/useMutate';
import { Imutation } from '@/interface/mutation.interface';
import TableIncoming from './tableIncoming';
import TableOutcoming from './tableOutcoming';
export default function MutationList() {
  const { data: lists } = useListWarehouse();
  const listWarehouseOnly: listWarehouseInterface[] = lists?.data.data || [];
  const [selectWarehouse, setSelectWarehouse] = useState<number>(0);
  const [pageIncome, setPageIncome] = useState<number>(1);
  const [pageOutcome, setPageOutcome] = useState<number>(1);
  const limit = 5;
  const { data: mutationWarehouse, isPlaceholderData } =
    useGetWarehouseMutation(
      Number(selectWarehouse),
      pageOutcome,
      pageIncome,
      limit,
    );
  const handleClickButtonIncome = (type: string): void => {
    if (type === 'next') {
      setPageIncome((old: number) => old + 1);
    }
    if (type === 'prev') {
      setPageIncome((old: number) => Math.max(old - 1, 1));
    }
  };
  const handleClickButtonOutcome = (type: string): void => {
    if (type === 'next') {
      setPageOutcome((old: number) => old + 1);
    }
    if (type === 'prev') {
      setPageOutcome((old: number) => Math.max(old - 1, 1));
    }
  };
  const incomingMutation: Imutation[] =
    mutationWarehouse?.data?.data?.incomingRequest.data || [];
  const totalPagesIncome =
    mutationWarehouse?.data?.data?.incomingRequest.totalPageIncoming || 0;
  const outcomingMutation: Imutation[] =
    mutationWarehouse?.data?.data?.outcomingRequest.data || [];
  const totalPagesOutcome =
    mutationWarehouse?.data?.data?.outcomingRequest.totalPageOutcoming || 0;

  return (
    <Box bg="#FDFFE2" p={10}>
      <Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          flexFlow={{ base: 'column-reverse', xl: 'row' }}
          gap={4}
        >
          <Heading
            textAlign={{ base: 'center', '2xl': 'start' }}
            size={'2xl'}
            mb={7}
          >
            Incoming Request
          </Heading>
          <Select
            placeholder="Select warehouse"
            w={'355px'}
            value={selectWarehouse}
            onChange={(e) => setSelectWarehouse(Number(e.target.value))}
          >
            {listWarehouseOnly.map((warehouse) => (
              <option
                key={warehouse.id}
                value={warehouse.id}
              >{`${warehouse.warehouse_name} - ${warehouse.warehouse_city}`}</option>
            ))}
          </Select>
        </Box>
        {!selectWarehouse ? (
          <Heading size={'md'}>*Please choose the warehouse</Heading>
        ) : (
          <TableContainer>
            <TableIncoming incomingMutation={incomingMutation} />
            {incomingMutation?.length > 0 && (
              <Paginate
                isPlaceholderData={isPlaceholderData}
                page={pageIncome}
                totalPages={totalPagesIncome}
                handleClickButton={handleClickButtonIncome}
              />
            )}
          </TableContainer>
        )}
      </Box>
      <Box mt={20}>
        <Heading
          textAlign={{ base: 'center', '2xl': 'start' }}
          size={'2xl'}
          mb={7}
        >
          Outcoming Request
        </Heading>
        {!selectWarehouse ? (
          <Heading size={'md'}>*Please choose the warehouse</Heading>
        ) : (
          <TableContainer>
            <TableOutcoming outcomingMutation={outcomingMutation} />
            {outcomingMutation?.length > 0 && (
              <Paginate
                isPlaceholderData={isPlaceholderData}
                page={pageOutcome}
                totalPages={totalPagesOutcome}
                handleClickButton={handleClickButtonOutcome}
              />
            )}
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
