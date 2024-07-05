'use client';
import { Box, Divider, Heading, SimpleGrid } from '@chakra-ui/react';
import { useContext } from 'react';

import { AuthContext } from '@/context/Auth';

import MutationList from './components/mutationList';
import RequestForm from './components/requestForm';

export default function StockMutation() {
  const users = useContext(AuthContext);
  const userDetail = users.user;
  return (
    <Box bgColor={'#fdfdfd'} p={5}>
      <Box my={3}>
        <Heading size={'4xl'}>Stock Mutation</Heading>
      </Box>
      <Divider my={5}></Divider>
      <Box>
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
          <MutationList />
          <RequestForm userDetail={userDetail} />
        </SimpleGrid>
      </Box>
    </Box>
  );
}
