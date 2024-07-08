// TODO: Change distination address from hardcode with the help of open cage

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
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/Auth';

interface Address {
  street: string;
  postal_code: string;
  city: string;
  country: string;
  lat: string;
  long: string;
}

interface Item {
  name: string;
  quantity: number;
  totalPrice: number;
  totalWeight: number;
}

interface ItemListProps {
  items: Item[];
}

interface ShippingOption {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
}

const fetchNearestWarehouse = async (lat: string, long: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/mutation/nearest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          warehouseId: null,
          bookId: null,
          lat: lat,
          long: long,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log('🚀 ~ fetchNearestWarehouse ~ list nearest warehouse:', data);
      return data;
    } else {
      throw new Error('Failed to fetch nearest warehouse');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function CartPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useContext(AuthContext);

  console.log('USER:', user);

  const checkIsCartEmpty = () => {
    if (items.length === 0) {
      return true;
    }
    return false;
  };

  const handlePaymentClick = async () => {
    const isStockSufficient = await checkStockAvailability();

    if (!isStockSufficient) {
      toast({
        title: 'Insufficient stock',
        description: 'One or more items in your cart are out of stock.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    router.push('/transaction');
  };

  const handleChangeAddressClick = () => {
    router.push('/deliveryaddress');
  };

  const checkStockAvailability = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/cart/check-stock`,
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
        return data.isStockSufficient;
      } else {
        throw new Error('Failed to check stock availability');
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const [address, setAddress] = useState<Address | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [finalWeight, setFinalWeight] = useState<number>(0);
  const [originAddressId, setOriginAddressId] = useState<string>('');
  const [destinationAddressId, setDestinationAddressId] = useState<string>('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const userId = user?.id; //useState<number>(user!.id);
  const [radioValue, setRadioValue] = useState<string>('');

  useEffect(() => {
    const storedAddress = sessionStorage.getItem('selectedAddress');
    if (storedAddress) {
      setAddress(JSON.parse(storedAddress));
    } else {
      const fetchDefaultAddress = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/address/default`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: userId }),
            },
          );
          if (response.ok) {
            const data = await response.json();
            setAddress(data);
            sessionStorage.setItem('selectedAddress', JSON.stringify(data));
          } else {
            throw new Error('Failed to fetch default address');
          }
        } catch (error) {
          console.error(error);
        }
      };

      if (userId) fetchDefaultAddress();
    }
  }, [userId]);

  useEffect(() => {
    const fetchCartId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/cart/get-cart-id/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ userId }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          setCartId(data.cartId.id);
        } else {
          throw new Error('Failed to fetch cart ID');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) fetchCartId();
  }, [userId]);

  useEffect(() => {
    if (cartId !== null) {
      console.log('cartId is', cartId);
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

            const totPrice = data.returnResult.reduce(
              (sum: number, item: Item) => sum + item.totalPrice,
              0,
            );
            setFinalPrice(totPrice);

            const totWeight = data.returnResult.reduce(
              (sum: number, item: Item) => sum + item.totalWeight,
              0,
            );
            setFinalWeight(totWeight);
          } else {
            throw new Error('Failed to fetch cart items');
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchCartItems(cartId);
    }
  }, [cartId]);

  useEffect(() => {
    const getOriginCityId = async () => {
      try {
        const oriAddress = address?.city;
        console.log('city name:', oriAddress);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/raja-ongkir/city-id`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cityName: oriAddress }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log('ini city id yang diterima:', data);
          setOriginAddressId(data?.cityId);
        } else {
          throw new Error('Failed to fetch cart ID');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getOriginCityId();
  }, [address]);

  // Buat yang sama dengan destination address
  useEffect(() => {
    const getDestinationCityId = async () => {
      try {
        let nearestWareHouseCity;
        if (address) {
          const data = await fetchNearestWarehouse(address.lat, address.long);
          nearestWareHouseCity = data.data[0].city;
          console.log('Nearest WH CName:', nearestWareHouseCity);
          sessionStorage.setItem(
            'selectedWarehouse',
            JSON.stringify(data?.data[0]),
          );
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/raja-ongkir/city-id`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cityName: nearestWareHouseCity }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log('ini warehouse id yang diterima:', data);
          setDestinationAddressId(data.cityId);
        } else {
          throw new Error('Failed to fetch cart ID');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getDestinationCityId();
  }, [address]);

  useEffect(() => {
    const calculateShippingCost = async () => {
      try {
        console.log('=======');
        console.log('origin:', originAddressId);
        console.log('dest:', destinationAddressId);
        console.log('weight', finalWeight.toString);

        const response = await fetch(
          'https://raja-ongkir-proxy.vercel.app/api/get-delivery-cost',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              origin: originAddressId,
              destination: destinationAddressId,
              weight: finalWeight.toString(),
              courier: 'jne',
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setShippingOptions(data.rajaongkir.results[0].costs);

          // set default radio group button
          setRadioValue(data.rajaongkir.results[0].costs[0].service);
        }
      } catch (error) {
        throw error;
      }
    };

    calculateShippingCost();
  }, [originAddressId, destinationAddressId, finalWeight]);

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

  useEffect(() => {
    if (cartId !== null) {
      sessionStorage.setItem('cardId', cartId.toString());
    }
  }, [cartId]);

  useEffect(() => {
    const selectedOption = shippingOptions.find(
      (option) => option.service === radioValue,
    );
    if (selectedOption) {
      sessionStorage.setItem(
        'hargaOngkir',
        selectedOption.cost[0].value.toString(),
      );
    }
  }, [radioValue, shippingOptions]);

  useEffect(() => {
    sessionStorage.setItem('hargaBuku', finalPrice.toString());
  }, [finalPrice]);

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
            <Text>Harga Buku: {finalPrice}</Text>
            <Text>Berat Buku: {finalWeight}</Text>
          </Box>

          <Button
            mt={4}
            colorScheme="orange"
            size="lg"
            w="full"
            display={{ sm: 'none', md: 'none', lg: 'block' }}
            onClick={async () => {
              if (checkIsCartEmpty()) {
                toast({
                  title: 'Cart is empty',
                  description:
                    'Please add items to your cart before proceeding to payment.',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              } else {
                const isStockSufficient = await checkStockAvailability();

                if (!isStockSufficient) {
                  toast({
                    title: 'Insufficient stock',
                    description:
                      'One or more items in your cart are out of stock.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  });
                  return;
                }

                handlePaymentClick();
              }
            }}
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
            <Button
              mt={4}
              colorScheme="orange"
              size="sm"
              w="full"
              onClick={handleChangeAddressClick}
            >
              Ganti Alamat
            </Button>
          </Box>

          <Box mt={4} py={4} px={4} w={'100%'} bgColor={'gray.100'}>
            <Text mb={2} fontWeight="bold">
              Metode Pengiriman (JNE Only)
            </Text>
            <RadioGroup
              onChange={setRadioValue}
              value={radioValue}
              defaultValue="REG"
            >
              <Stack direction="column" spacing={3}>
                {shippingOptions.map((option) => (
                  <Radio
                    key={option.service}
                    colorScheme="orange"
                    value={option.service}
                  >
                    {option.service} - Rp {option.cost[0].value}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
