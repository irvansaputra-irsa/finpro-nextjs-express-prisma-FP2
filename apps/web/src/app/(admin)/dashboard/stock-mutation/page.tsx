'use client';
import { AuthContext } from '@/context/Auth';
import {
  reqProductMutation,
  useRequestProductMutation,
} from '@/hooks/useMutateMutation';
import {
  useFindWarehouseByAdmin,
  useListWarehouse,
  useWarehouse,
} from '@/hooks/useWarehouse';
import { useGetWarehouseStockOnMutationReq } from '@/hooks/useWarehouseStock';
import { productStock } from '@/interface/stock.interface';
import {
  listWarehouseInterface,
  warehouse,
} from '@/interface/warehouse.interface';
import { errorResponse } from '@/types/errorResponse';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AsyncSelect, SelectInstance, SingleValue } from 'chakra-react-select';
import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type ProductOption = {
  value: string;
  label: string;
};

export default function StockMutation() {
  const users = useContext(AuthContext);
  const userDetail = users.user;
  //example karena blm bs dpt token user - notes token harusnya ada id user dan role usernya
  //super admin
  // const userId = 29;
  // const userRole = 'super admin';

  //admin biasa
  // 1. identify dulu dia itu super admin atau warehouse admin biasa
  // 2. kalo dia super admin, select formnya bebas
  // 3. kalo dia warehouse admin biasa, select formnya yg MUTATION FROM auto ke select warehouse dia sendiri
  const { data: warehouseDetailByAdmin } = useFindWarehouseByAdmin(
    Number(userDetail?.id),
  );
  const warehouseDetail: warehouse = warehouseDetailByAdmin?.data.data || null;
  // 4. dan select form MUTATION TO di filter dari value MUTATION FORMNYA
  // 5. LIST BOOK-nya dpt dari list warehouse tujuannya
  const toast = useToast();
  const { data: warehouses } = useWarehouse();
  const listWarehouse: warehouse[] = warehouses?.data.data || []; // list warehouse semuanya dulu
  const fetchAvailableWarehouseAuth =
    userDetail?.role === 'admin'
      ? [...listWarehouse]?.filter((w) => w.id === warehouseDetail?.id)
      : listWarehouse;
  const [selectFrom, setSelectFrom] = useState<string | ''>('');
  const [selectTo, setSelectTo] = useState<string | ''>('');
  const handleSelectFrom = (
    e: ChangeEvent<HTMLSelectElement>,
    type: string,
  ) => {
    const selected = e.target.value;
    if (selected) {
      if (type === 'from') setSelectFrom(selected);
      else {
        if (prSelectRef.current) {
          prSelectRef.current.clearValue();
        }
        setSelectTo(selected);
      }
    }
  };
  const [filteredList, setFilteredList] = useState<warehouse[] | []>([]);
  useEffect(() => {
    if (selectFrom) {
      setFilteredList(
        [...listWarehouse].filter((el) => el.id !== Number(selectFrom)),
      );
      setSelectTo('');
    }
  }, [selectFrom]);
  const { data: listProducts } = useGetWarehouseStockOnMutationReq(
    Number(selectTo),
  );
  const listProductsAvailable: productStock[] = listProducts?.data.data || [];
  let mapListProductAvailable: ProductOption[] = [];
  if (listProductsAvailable) {
    mapListProductAvailable = listProductsAvailable.map((product) => ({
      ['label']: product.book.book_name,
      ['value']: product.book_id.toString(),
    }));
  }

  const [selectProduct, setSelectProduct] = useState<string>('');
  const handleSelectProduct = (selected: SingleValue<ProductOption>) => {
    if (selected) {
      setSelectProduct(selected.value);
    }
  };

  const qtyRef = useRef<HTMLInputElement | null>(null);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  let prSelectRef = useRef<SelectInstance<ProductOption | null>>(null);
  const handleClearForm = (): void => {
    setSelectFrom('');
    setSelectTo('');
    setSelectProduct('');
    if (prSelectRef.current) {
      prSelectRef.current.clearValue();
    }
    if (qtyRef?.current) {
      qtyRef.current.value = '';
    }
    if (notesRef?.current) {
      notesRef.current.value = '';
    }
  };
  const queryClient = useQueryClient();
  const { mutateAsync: reqProductMutation, isSuccess } =
    useRequestProductMutation();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: reqProductMutation = {
      senderWarehouseId: Number(selectFrom),
      receiverWarehouseId: Number(selectTo),
      bookId: Number(selectProduct),
      qty: qtyRef?.current ? Number(qtyRef?.current.value) : 0,
      senderName: 'Bianca', //harusnya ambil dari token, tapi buat sementara statis dulu
      senderNotes: notesRef?.current ? notesRef.current.value : '',
    };
    reqProductMutation(payload, {
      onSuccess: () => {
        handleClearForm();
        toast({
          title: 'Request sent!',
          description: 'Please wait for the confirmation',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries({ queryKey: ['request-mutation'] });
      },
      onError: (err) => {
        const res = err.response?.data as errorResponse;
        toast({
          title: 'Request failed!',
          description: res.message || 'An error occurred',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      },
    });
  };

  //logic buat list mutationnya, get all list atau per warehouse admin
  //get list warehouse buat di select option
  const { data: lists } = useListWarehouse();
  const listWarehouseOnly: listWarehouseInterface[] = lists?.data.data || [];

  return (
    <Box bgColor={'#fdfdfd'} p={5}>
      <Box my={3}>
        <Heading size={'4xl'}>Stock Mutation</Heading>
      </Box>
      <Divider my={5}></Divider>
      <Box>
        <SimpleGrid columns={{ base: 1, xl: 2 }}>
          <Box bg="#FDFFE2" p={10}>
            <Box>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                flexFlow={{ base: 'column-reverse', xl: 'row' }}
              >
                <Heading
                  textAlign={{ base: 'center', '2xl': 'start' }}
                  size={'2xl'}
                  mb={7}
                >
                  Incoming Request
                </Heading>
                <Select
                  placeholder="Select warehouse"
                  w={'355px'}
                  // value={selectWarehouseMutation}
                >
                  {listWarehouseOnly.map((warehouse) => (
                    <option
                      key={warehouse.id}
                      value={warehouse.id}
                    >{`${warehouse.warehouse_name} - ${warehouse.warehouse_city}`}</option>
                  ))}
                </Select>
              </Box>
              <TableContainer>
                <Table variant="striped" colorScheme="teal">
                  <Thead>
                    <Tr>
                      <Th>Request from (warehouse)</Th>
                      <Th>Book Name</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td isNumeric>25.4</Td>
                      <Td>inches</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                      <Td>inches</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                      <Td>inches</Td>
                    </Tr>
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                      <Td>inches</Td>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Box>
            <Box mt={20}>
              <Heading
                textAlign={{ base: 'center', '2xl': 'start' }}
                size={'2xl'}
                mb={7}
              >
                Outcoming Request
              </Heading>
              <TableContainer>
                <Table variant="striped" colorScheme="teal">
                  <Thead>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td isNumeric>25.4</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Box px={5}>
            <Box px={5} py={10} border={'2px dashed #FBDEBB'} borderRadius={10}>
              <Heading textAlign={'center'} mb={5} size={'xl'}>
                Request product mutation
              </Heading>
              <form onSubmit={(e) => handleSubmit(e)}>
                <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>
                  <FormControl>
                    <FormLabel>Mutation from</FormLabel>
                    <Select
                      isRequired
                      placeholder="Select warehouse"
                      onChange={(e) => handleSelectFrom(e, 'from')}
                      value={selectFrom}
                    >
                      {fetchAvailableWarehouseAuth.length &&
                        fetchAvailableWarehouseAuth?.map((el) => (
                          <option value={el.id} key={el.id}>
                            {el.warehouse_name} - {el.warehouse_city}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Mutation to</FormLabel>
                    <Select
                      isRequired
                      placeholder="Select warehouse"
                      disabled={!selectFrom}
                      onChange={(e) => handleSelectFrom(e, 'to')}
                      value={selectTo}
                    >
                      {filteredList?.map((el) => (
                        <option value={el.id} key={el.id}>
                          {el.warehouse_name} - {el.warehouse_city}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <Grid
                  templateColumns={{
                    base: 'repeat(1, 1fr)',
                    xl: 'repeat(12, 1fr)',
                  }}
                  my={3}
                >
                  <GridItem colSpan={{ base: 12, '2xl': 5 }} mr={{ xl: 5 }}>
                    <FormControl>
                      <FormLabel>Book Name</FormLabel>
                      <AsyncSelect
                        ref={prSelectRef}
                        onChange={(selected) => handleSelectProduct(selected)}
                        instanceId={'books'}
                        name="books"
                        cacheOptions
                        options={mapListProductAvailable}
                        isDisabled={!mapListProductAvailable}
                        isRequired
                        placeholder="Select book..."
                        defaultOptions={mapListProductAvailable}
                        defaultValue={mapListProductAvailable.find(
                          (p) => p.value === selectProduct.toString(),
                        )}
                        loadOptions={(inputValue, callback) => {
                          setTimeout(() => {
                            const values = mapListProductAvailable?.filter(
                              (option) =>
                                option.label
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase()),
                            );
                            callback(values);
                          }, 1000);
                        }}
                      ></AsyncSelect>
                      <FormHelperText color={'gray.500'}>
                        Notes: Book must be available at warehouse destination
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                  <GridItem
                    colSpan={{ base: 12, '2xl': 4 }}
                    mt={{ base: 5, '2xl': 'unset' }}
                  >
                    <FormControl>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        ref={qtyRef}
                        type="number"
                        placeholder="input number here"
                      ></Input>
                    </FormControl>
                  </GridItem>
                </Grid>
                <FormControl my={4}>
                  <FormLabel>Additional note (optional)</FormLabel>
                  <Textarea
                    ref={notesRef}
                    placeholder="Input your notes..."
                  ></Textarea>
                </FormControl>
                <Flex
                  justifyContent={'end'}
                  flexDirection={{ base: 'column', xl: 'row' }}
                >
                  <Button
                    type="button"
                    colorScheme="gray"
                    my={{ base: 5, xl: 'unset' }}
                    mx={{ base: 'unset', xl: 5 }}
                    minW={{ base: 'full', xl: 24 }}
                    onClick={() => handleClearForm()}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="orange"
                    minW={{ base: 'full', xl: 24 }}
                  >
                    Submit
                  </Button>
                </Flex>
              </form>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
