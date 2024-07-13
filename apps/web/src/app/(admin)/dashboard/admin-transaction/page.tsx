// TODO 1. change user id from hardcode
// TODO 2. change user role from hardcode
// TODO 3. implement pop up untuk check image proof
// TODO 4. implement (proses -> ready): check stock, mutasi, dll

'use client';

import axios from 'axios';
import {
  Box,
  Heading,
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
  Image,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/Auth';

interface Transaction {
  id: number;
  status: string;
  payment_method: string;
  created_at: string;
  final_price: number;
  payment_proof: string;
}

const AdminTransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchDate, setSearchDate] = useState('');
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('super admin');

  useEffect(() => {
    console.log('date changes');
    fetchTransactions();
  }, [searchDate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/admin`,
        {
          userId: user?.id,
          role: user?.role,
          searchDate,
        },
      );

      console.log(response.data);
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

  const handleUpdateStatus = async (transactionId: number, status: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/update-status`,
        {
          transactionId,
          status,
        },
      );
      toast({
        title: 'Transaction status updated',
        description: `The transaction status has been updated to ${status}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions();
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      toast({
        title: 'Error updating transaction status',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAccept = async (transactionId: number, status: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/accept`,
        {
          transactionId,
        },
      );
      toast({
        title: 'Transaction status updated',
        description: `The transaction status has been updated to ${status}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions();
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      toast({
        title: 'Error updating transaction status',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = async (transactionId: number, status: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/cancel`,
        {
          transactionId,
        },
      );
      toast({
        title: 'Transaction status updated',
        description: `The transaction status has been updated to ${status}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions();
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      toast({
        title: 'Error updating transaction status',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSend = async (transactionId: number, status: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/send`,
        {
          transactionId,
        },
      );
      toast({
        title: 'Transaction status updated',
        description: `The transaction status has been updated to ${status}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions();
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      toast({
        title: 'Error updating transaction status',
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
          Admin Transaction History
        </Heading>
        <Flex>
          <Input
            type="date"
            placeholder="Search by date"
            value={searchDate}
            onChange={handleSearchChange}
            minW="60vw"
          />
          <Button
            ml={2}
            colorScheme="gray"
            variant="outline"
            onClick={fetchTransactions}
          >
            ⟳
          </Button>
        </Flex>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Payment Method</Th>
              <Th>Created Date</Th>
              <Th>Final Price</Th>
              <Th>Payment Proof</Th>
              <Th>Proof Action</Th>
              <Th>Ship Item</Th>
              <Th>Cancel Shipping</Th>
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
                  <Image
                    src="loren.png" // pakai transaction.payment_proof url and show pop up kalo di klik
                    alt="Payment Proof"
                    boxSize="20px"
                  />
                </Td>
                <Td>
                  <Flex>
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => {
                        handleUpdateStatus(transaction.id, 'on process');
                        /**
                         * Disini, setelah status berubah menjadi on process,
                         * pastikan kesiapan barang, mutasi, dkk.
                         */
                        handleAccept(transaction.id, 'ready');
                      }}
                      isDisabled={transaction.status !== 'waiting approval'}
                      mr="2"
                    >
                      Accept
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(transaction.id, 'payment rejected')
                      }
                      isDisabled={transaction.status !== 'waiting approval'}
                    >
                      Reject
                    </Button>
                  </Flex>
                </Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleSend(transaction.id, 'on delivery')}
                    isDisabled={transaction.status !== 'ready'}
                  >
                    Ship
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="orange"
                    onClick={() => handleCancel(transaction.id, 'cancelled')}
                    isDisabled={
                      transaction.status === 'on delivery' ||
                      transaction.status === 'cancelled' ||
                      transaction.status === 'completed'
                    }
                  >
                    Cancel
                  </Button>
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

export default AdminTransactionPage;
