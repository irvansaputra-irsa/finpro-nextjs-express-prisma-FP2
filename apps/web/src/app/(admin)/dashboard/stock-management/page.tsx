'use client';
import { AuthContext } from '@/context/Auth';
import { useWarehouse } from '@/hooks/useWarehouse';
import { warehouse } from '@/interface/warehouse.interface';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Hide,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { FaHouseChimney } from 'react-icons/fa6';
import { IoIosPerson } from 'react-icons/io';
export default function StockList() {
  const { data } = useWarehouse(true);
  const warehouseList: warehouse[] = data?.data.data || [];
  const router = useRouter();
  const path = usePathname();
  const handleClick = (id: number) => {
    router.push(`${path}/warehouse?id=${id}`);
  };
  return (
    <Box p={5} bgColor={'#fdfdfd'} w={{ base: 'full', xl: '60vw' }}>
      <Box my={5}>
        <Heading size={'4xl'} fontWeight={'bold'}>
          Warehouse
        </Heading>
      </Box>
      <Divider color={'black'} />
      <SimpleGrid columns={3}>
        {warehouseList?.map((el, idx) => (
          <Box
            key={idx}
            w={'80%'}
            minH={115}
            py={5}
            px={3}
            bgColor={'#CCD3CA'}
            borderRadius={16}
            pos={'relative'}
            my={5}
            cursor={'pointer'}
            boxShadow={
              'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px'
            }
            onClick={() => handleClick(el?.id)}
          >
            <Flex alignItems={'center'} justifyContent={'center'}>
              <Box mr={3} alignSelf={'center'}>
                <FaHouseChimney size={60} />
              </Box>
              <Box>
                <Text fontSize={'xl'} color={'gray.600'} fontWeight={'bold'}>
                  {el.warehouse_name}
                </Text>
                <Text
                  fontSize={'md'}
                >{`${el.warehouse_city}, ${el.warehouse_province}`}</Text>
                <Hide below="md">
                  <Flex
                    pos={'absolute'}
                    bottom={1}
                    left={4}
                    alignItems={'center'}
                  >
                    <IoIosPerson />
                    <Text fontSize={'md'}>
                      {el?.user?.user_name ?? 'Admin'}
                    </Text>
                  </Flex>
                </Hide>
              </Box>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
