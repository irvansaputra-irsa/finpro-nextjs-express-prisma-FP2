import { IUser } from '@/context/Auth';
import {
  reqProductMutation,
  useRequestProductMutation,
} from '@/hooks/useMutateMutation';
import { useFindWarehouseByAdmin, useWarehouse } from '@/hooks/useWarehouse';
import { useGetWarehouseStockOnMutationReq } from '@/hooks/useWarehouseStock';
import { productStock } from '@/interface/stock.interface';
import { warehouse } from '@/interface/warehouse.interface';
import { errorResponse } from '@/types/errorResponse';
import {
  Box,
  Button,
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
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AsyncSelect, SelectInstance, SingleValue } from 'chakra-react-select';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
type ProductOption = {
  value: string;
  label: string;
};
type props = {
  userDetail: IUser | null;
};
export default function RequestForm({ userDetail }: props) {
  const { data: warehouseDetailByAdmin } = useFindWarehouseByAdmin(
    Number(userDetail?.id),
  );
  // const warehouseDetail: warehouse = warehouseDetailByAdmin?.data.data || null;
  const toast = useToast();
  const { data: warehouses } = useWarehouse(false);
  const [fetchAvailableWarehouseAuth, setFetchAvailableWarehouseAuth] =
    useState<warehouse[]>([]);
  useEffect(() => {
    if (warehouses?.data?.data && warehouseDetailByAdmin?.data?.data) {
      const lists =
        userDetail?.role.toLowerCase() === 'admin'
          ? [...warehouses?.data.data]?.filter(
              (w) => w.id === warehouseDetailByAdmin.data.data.id,
            )
          : warehouses?.data.data;
      setFetchAvailableWarehouseAuth(lists);
    }
  }, [warehouses, warehouseDetailByAdmin, userDetail]);

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
        [...warehouses?.data.data].filter((el) => el.id !== Number(selectFrom)),
      );
      setSelectTo('');
    }
  }, [selectFrom, warehouses?.data?.data]);
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
  const { mutate: reqProductMutation } = useRequestProductMutation();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: reqProductMutation = {
      senderWarehouseId: Number(selectFrom),
      receiverWarehouseId: Number(selectTo),
      bookId: Number(selectProduct),
      qty: qtyRef?.current ? Number(qtyRef?.current.value) : 0,
      senderName: userDetail?.userName || '',
      senderNotes: notesRef?.current && notesRef.current.value,
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
        if (err instanceof AxiosError) {
          const res = err.response?.data as errorResponse;
          toast({
            title: 'Request failed!',
            description: res.message || 'An error occurred',
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        }
      },
    });
  };
  return (
    <Box px={5}>
      <Box px={5} py={10} border={'2px dashed #FBDEBB'} borderRadius={10}>
        <Heading textAlign={'center'} mb={5} size={'xl'}>
          Request product mutation
        </Heading>
        <form onSubmit={(e) => handleSubmit(e)}>
          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>
            <FormControl isRequired>
              <FormLabel>Request from</FormLabel>
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
            <FormControl isRequired>
              <FormLabel>Request to</FormLabel>
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
              <FormControl isRequired>
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
                      const values = mapListProductAvailable?.filter((option) =>
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
              <FormControl isRequired>
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
  );
}
