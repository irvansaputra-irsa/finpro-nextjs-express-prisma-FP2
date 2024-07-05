'use client';

import { Box, Divider, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/Auth';

interface Address {
  id: number;
  street: string;
  postal_code: number;
  city: string;
  country: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function ShowAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/address/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setAddresses(data.addresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, [userId]);

  const backToCart = () => {
    router.push('/cart');
  };

  const handleAddressSelect = (address: Address) => {
    sessionStorage.setItem('selectedAddress', JSON.stringify(address));

    const storedAddress = sessionStorage.getItem('selectedAddress');
    if (storedAddress) {
      const selectedAddress: Address = JSON.parse(storedAddress);
      //       alert(`Alamat berhasil disimpan!
      // Jalan: ${selectedAddress.street}
      // Kode Pos: ${selectedAddress.postal_code}
      // Kota: ${selectedAddress.city}
      // Negara: ${selectedAddress.country}`);
      backToCart();
    } else {
      console.error('Failed to retrieve selected address from session storage');
    }
  };

  return (
    <Box>
      <Box py={4} px={4}>
        <Heading pb={4}>Pilih Alamat Anda</Heading>
        <Divider borderColor="gray.200" borderWidth="2px" w="50%" />
      </Box>

      <Box py={4} px={4} h={'70vh'} maxH={'70vh'} overflowY="scroll">
        <Flex wrap="wrap" justify="space-between">
          {addresses.map((address) => (
            <Box
              key={address.id}
              mt={0}
              py={4}
              px={4}
              w={'49%'}
              bgColor={'gray.100'}
              mb={4}
            >
              <Text mb={2} fontWeight="bold">
                Alamat Pengiriman
              </Text>
              <Text>Jalan: {address.street}</Text>
              <Text>Kode Pos: {address.postal_code}</Text>
              <Text>Kota: {address.city}</Text>
              <Text>Negara: {address.country}</Text>
              <Button
                mt={4}
                colorScheme="orange"
                size="sm"
                w="full"
                onClick={() => handleAddressSelect(address)}
              >
                Ganti Alamat
              </Button>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
