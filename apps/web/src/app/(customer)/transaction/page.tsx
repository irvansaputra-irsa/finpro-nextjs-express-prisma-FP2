// TODO 1. change warehouse id from hardcode
// TODO 2. create button to proceed transaction along with multer

'use client';

import {
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  useToast,
  Button,
  Input,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function TransactionPage() {
  const [cardId, setCartId] = useState<string>('');
  const [addrId, setAddrId] = useState<string>('');
  const [hargaOngkir, setHargaOngkir] = useState<string>('');
  const [hargaBuku, setHargaBuku] = useState<string>('');
  const [hargaTotal, setHargaTotal] = useState<number>(0);
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const paymentMethod = 'manual';

  useEffect(() => {
    const storedCardId = window.sessionStorage.getItem('cardId');
    if (storedCardId) {
      setCartId(storedCardId.toString());
    }
  }, []);

  useEffect(() => {
    const storedAddress = window.sessionStorage.getItem('selectedAddress');
    if (storedAddress) {
      const address = JSON.parse(storedAddress);
      setAddrId(address.id);
    }
  }, []);

  useEffect(() => {
    const storedHargaOngkir = window.sessionStorage.getItem('hargaOngkir');
    if (storedHargaOngkir) {
      setHargaOngkir(storedHargaOngkir.toString());
    }
  }, []);

  useEffect(() => {
    const storedHargaBuku = window.sessionStorage.getItem('hargaBuku');
    if (storedHargaBuku) {
      setHargaBuku(storedHargaBuku.toString());
    }
  }, []);

  useEffect(() => {
    const ongkir = parseFloat(hargaOngkir);
    const buku = parseFloat(hargaBuku);

    setHargaTotal(ongkir + buku);
  }, [hargaOngkir, hargaBuku]);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      toast({
        title: 'File too large',
        description: 'The file size should be less than 1MB.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setFile(file);
      toast({
        title: 'File accepted',
        description: 'The file has been successfully uploaded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" p={4}>
      <VStack spacing={4} textAlign="center">
        <Heading as="h1" size="xl" mb={4} borderBottom="2px solid">
          Transaction
        </Heading>
        <Text>Card id {cardId}</Text>
        <Text>Address id {addrId}</Text>
        <Text fontSize="xl">Total Price: Rp {hargaTotal}</Text>
        <Box>
          <Button as="label" cursor="pointer">
            Select Image
            <Input
              type="file"
              accept="image/*"
              display="none"
              onChange={handleFileChange}
            />
          </Button>
          <Text fontSize="sm" color="gray.500">
            Maximum file size: 1MB
          </Text>
        </Box>
        {file && (
          <Box mt={4}>
            <Text>Selected file: {file.name}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
