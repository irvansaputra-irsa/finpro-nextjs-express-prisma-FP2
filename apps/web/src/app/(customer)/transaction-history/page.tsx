'use client';

import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  VStack,
  useToast,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: number;
  status: string;
  payment_method: string;
  created_at: string;
  final_price: number;
}

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchDate, setSearchDate] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [page, searchDate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/fetch`,
        {
          userId: 1,
          searchDate,
        },
      );

      setTransactions(response.data);
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      toast({
        title: 'Error fetching transactions',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleConfirmOrder = async (transactionId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/confirm`,
        {
          transactionId,
        },
      );
      toast({
        title: 'Order confirmed',
        description: 'The order has been successfully confirmed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      toast({
        title: 'Error confirming order',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" p={4}>
      <VStack spacing={4} textAlign="center">
        <Heading as="h1" size="xl" mb={4} borderBottom="2px solid">
          Transaction History
        </Heading>
        <Input
          type="date"
          placeholder="Search by date"
          value={searchDate}
          onChange={handleSearchChange}
        />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Payment Method</Th>
              <Th>Order Date</Th>
              <Th>Final Price</Th>
              <Th>Confirm Payment</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.status}</Td>
                <Td>{transaction.payment_method}</Td>
                <Td>{new Date(transaction.created_at).toLocaleString()}</Td>
                <Td>{transaction.final_price}</Td>
                <Td>
                  {transaction.status === 'on delivery' ? (
                    <Button
                      colorScheme="green"
                      onClick={() => handleConfirmOrder(transaction.id)}
                    >
                      Confirm Order
                    </Button>
                  ) : transaction.status === 'completed' ? (
                    <Text>Payment Confirmed</Text>
                  ) : (
                    'Not Yet Available'
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box>
          {Array.from(
            { length: Math.ceil(totalTransactions / pageSize) },
            (_, i) => (
              <Button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                colorScheme={i + 1 === page ? 'blue' : 'gray'}
                m={1}
              >
                {i + 1}
              </Button>
            ),
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default TransactionHistoryPage;
