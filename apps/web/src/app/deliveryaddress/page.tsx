import { Box, Divider, Heading, Text, Button } from '@chakra-ui/react';
import Head from 'next/head';

export default function CartPage() {
  return (
    <Box>
      <Box py={4} px={4}>
        <Heading pb={4}>Pilih Alamat Anda</Heading>
        <Divider borderColor="gray.200" borderWidth="2px" w="50%" />
      </Box>

      <Box py={4} px={4} h={'70vh'} maxH={'70vh'} overflowY="scroll">
        <Box mt={0} py={4} px={4} w={'100%'} bgColor={'gray.100'}>
          <Text mb={2} fontWeight="bold">
            Alamat Pengiriman
          </Text>
          <Text>Jalan:</Text>
          <Text>Kode Pos:</Text>
          <Text>Kota:</Text>
          <Text>Negara:</Text>
          <Button mt={4} colorScheme="orange" size="sm" w="full">
            Ganti Alamat
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
