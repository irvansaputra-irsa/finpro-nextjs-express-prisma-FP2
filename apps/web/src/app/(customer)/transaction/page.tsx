// TODO: 1. change warehouse id to nearest warehouse

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
  Image,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TransactionPage() {
  const [cardId, setCartId] = useState<string>('');
  const [addrId, setAddrId] = useState<string>('');
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [hargaOngkir, setHargaOngkir] = useState<string>('');
  const [hargaBuku, setHargaBuku] = useState<string>('');
  const [hargaTotal, setHargaTotal] = useState<number>(0);
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleCancelButton = () => {
    router.push('/cart');
  };

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
    const storedWarehouse = window.sessionStorage.getItem('selectedWarehouse');
    if (storedWarehouse) {
      const warehouse = JSON.parse(storedWarehouse);
      if (warehouse) {
        setWarehouseId(warehouse?.warehouse?.toString());
      }
    }
  }, []);

  useEffect(() => {
    const ongkir = parseFloat(hargaOngkir);
    const buku = parseFloat(hargaBuku);

    setHargaTotal(ongkir + buku);
  }, [hargaOngkir, hargaBuku]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.size > 1048576) {
      toast({
        title: 'File too large',
        description: 'The file size should be less than 1MB.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setFile(selectedFile);
      if (selectedFile) {
        setFilePreview(URL.createObjectURL(selectedFile));
      }
      toast({
        title: 'File accepted',
        description: 'The file has been successfully uploaded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('myFile', file);

      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const paymentProofUrl = uploadResponse.data.file.filename;
      console.log('this is payment proof');
      console.log(paymentProofUrl);

      const transactionData = {
        status: 'waiting approval',
        payment_method: 'upload proof',
        payment_proof: paymentProofUrl,
        confirmation_date: null,
        final_price: hargaTotal,
        destination_id: parseInt(addrId),
        warehouse_id: parseInt(warehouseId),
        cart_id: parseInt(cardId),
      };

      const transactionResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction`,
        transactionData,
      );

      toast({
        title: 'Transaction successful',
        description: 'Transaction created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Error details:', error.response.data);
      toast({
        title: 'Upload or Transaction failed',
        description: `There was an error: ${error.message}`,
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
          Transaction
        </Heading>
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
            {filePreview && (
              <Image
                src={filePreview}
                alt="Selected file preview"
                boxSize="200px"
                objectFit="cover"
                mt={4}
              />
            )}
          </Box>
        )}
        {!file && (
          <Button colorScheme="red" onClick={handleCancelButton}>
            Cancel
          </Button>
        )}
        {file && (
          <Button colorScheme="green" onClick={handleUpload}>
            Continue
          </Button>
        )}
      </VStack>
    </Box>
  );
}
