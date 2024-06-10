// TODO: 1. Change userId from hardcode
// TODO: 2. Change cartId from hardcode

'use client';

import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';

interface Address {
  street: string;
  postal_code: string;
  city: string;
  country: string;
}

interface Item {
  name: string;
  quantity: number;
  totalPrice: number;
}

interface ItemListProps {
  items: Item[];
}

export default function CartPage() {
  const [address, setAddress] = useState<Address | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const cartId = 2;

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/address/default`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: 1 }),
          },
        );
        if (response.ok) {
          console.log('reponse dot oke');
          const data = await response.json();
          setAddress(data);
        } else {
          throw new Error('Failed to fetch default address');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDefaultAddress();
  }, []);

  useEffect(() => {
    const fetchCartItems = async (cartId: number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/cart-item/all`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartId }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          setItems(data.returnResult);
        } else {
          throw new Error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error(error);
        // Handle error, show message to user, etc.
      }
    };

    fetchCartItems(cartId);
  }, [cartId]);

  const ItemList: React.FC<ItemListProps> = ({ items }) => {
    return (
      <Box mt={0} py={4} px={4} w={'100%'} bgColor={'gray.100'}>
        <Text fontWeight="bold">Item:</Text>
        <Box maxH={'200px'} overflowY="scroll">
          {items.map((item, index) => (
            <Flex
              key={index}
              direction={'row'}
              justifyContent={'space-between'}
              my={2}
            >
              <Flex direction={'column'}>
                <Box>{item.name}</Box>
                <Box>Kuantitas: {item.quantity}</Box>
              </Flex>
              <Box>Rp {item.totalPrice}</Box>
            </Flex>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box py={4} px={4}>
        <Heading pb={4}>CHECKOUT</Heading>
        <Divider borderColor="gray.200" borderWidth="2px" w="50%" />
      </Box>

      <Flex direction={{ base: 'column', md: 'column', lg: 'row-reverse' }}>
        <Box
          w={{ base: '100%', md: '100%', lg: '50%' }}
          h={{ base: '25vh', md: '30vh', lg: '65vh' }}
          p={4}
        >
          <ItemList items={items} />

          <Box mt={4} py={4} px={4} w={'100%'} bgColor={'gray.100'}>
            <Text mb={2} fontWeight="bold">
              Total
            </Text>
            <Text>Harga Buku:</Text>
            <Text>Ongkir:</Text>
          </Box>

          <Button
            mt={4}
            colorScheme="orange"
            size="lg"
            w="full"
            display={{ sm: 'none', md: 'none', lg: 'block' }}
          >
            Lanjut ke Pembayaran
          </Button>
        </Box>
        <Box
          w={{ base: '100%', md: '100%', lg: '50%' }}
          h={{ base: '25vh', md: '30vh', lg: '65vh' }}
          pl={4}
          pt={4}
        >
          <Box mt={0} py={4} px={4} w={'100%'} bgColor={'gray.100'}>
            <Text mb={2} fontWeight="bold">
              Alamat Pengiriman
            </Text>
            <Text>Jalan: {address?.street} </Text>
            <Text>Kode Pos: {address?.postal_code}</Text>
            <Text>Kota: {address?.city}</Text>
            <Text>Negara: {address?.country}</Text>
            <Button mt={4} colorScheme="orange" size="sm" w="full">
              Ganti Alamat
            </Button>
          </Box>

          <Box mt={4} py={4} px={4} w={'100%'} bgColor={'gray.100'}>
            <Text mb={2} fontWeight="bold">
              Metode Pengiriman (JNE Only)
            </Text>
            <RadioGroup>
              <Stack direction="column" spacing={3}>
                <Radio colorScheme="orange" value="REG">
                  REG (Reguler)
                </Radio>
                <Radio colorScheme="orange" value="OKE">
                  OKE (Ongkos Kirim Ekonomis)
                </Radio>
                <Radio colorScheme="orange" value="YES">
                  YES (Yakin Esok Sampai)
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
