'use client';
import Paginate from '@/components/pagination/paginate';
import { useProductCategory, useProductListCustomer } from '@/hooks/useProduct';
import { product, productCategory } from '@/interface/product.interface';
import { separateStringHyphen } from '@/utils/convert';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { CiSearch } from 'react-icons/ci';
import {
  Divider,
  Flex,
  Grid,
  GridItem,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Show,
  Text,
} from '@chakra-ui/react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ProductCard from './component/product';
import { useDebounce } from 'use-debounce';

export default function ProductListPage() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);

  const params = new URLSearchParams(searchParams);
  const pageQuery = params.get('page') || 1;
  const categoryQuery = params.get('category') || '';
  const searchQuery = params.get('search') || '';
  const sortQuery = params.get('sort') || '';

  const [page, setPage] = useState<number>(Number(pageQuery));
  const [sort, setSort] = useState<string>(sortQuery);
  const [search, setSearch] = useState<string>(searchQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>(categoryQuery);
  const [debounceSearch] = useDebounce(search.trim(), 1000);
  const limit = 12;
  const { data, isPlaceholderData } = useProductListCustomer(
    page,
    limit,
    sort,
    debounceSearch,
    categoryFilter,
  );
  const res = data?.data.data;
  const products: product[] = res?.data ?? [];

  const selectRef = useRef(null);
  const setQueryUrl = (param: string, value: string) => {
    queryParams.set(param, value);
    replace(`${pathname}?${queryParams.toString()}`, {
      scroll: false,
    });
  };

  //kategori
  const { data: category } = useProductCategory();
  const categoryList: productCategory[] = category?.data.data || [];
  const handleFilterCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      const currentCategory = e.target.value;
      // balikin jadi page 1 setiap filter category berubah
      setPage(1);
      setQueryUrl('page', '1');
      setCategoryFilter(separateStringHyphen(currentCategory));
      // set query param
      if (currentCategory) {
        setQueryUrl('category', currentCategory);
      } else {
        queryParams.delete('category');
        replace(`${pathname}?${queryParams.toString()}`, {
          scroll: false,
        });
      }
    }
  };
  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    const sorted = e.target.value;
    setQueryUrl('page', '1');
    setSort(sorted);
    setQueryUrl('sort', sorted);
  };

  const handleClickButton = (type: string): void => {
    if (type === 'next') {
      setPage((old: number) => old + 1);
      setQueryUrl('page', (page - 1).toString());
    }
    if (type === 'prev') {
      setPage((old: number) => Math.max(old - 1, 1));
      setQueryUrl('page', (page + 1).toString());
    }
  };

  useEffect(() => {
    if (!debounceSearch) {
      queryParams.delete('search');
      replace(`${pathname}?${queryParams.toString()}`, {
        scroll: false,
      });
    } else {
      setQueryUrl('search', debounceSearch);
    }
  }, [debounceSearch]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const currentSearch = e.target.value;
    setSearch(currentSearch);
    setPage(1);
  };

  return (
    <Box>
      <Stack>
        <Box position={'relative'}>
          <Img
            alt="headline-product-list-image"
            src={'https://images.unsplash.com/photo-1545244100-07c99f4d0492'}
            height={{ base: '150px', lg: '300px' }}
            width={'100%'}
            objectFit={'cover'}
            opacity={'90%'}
            objectPosition={{ base: '0 8%', lg: '0 37%' }}
          />
          <Box
            pos={'absolute'}
            top={'40%'}
            left={'50%'}
            transform={'translate(-50%, -50%)'}
          >
            <Heading
              fontSize={'3xl'}
              fontWeight={'bold'}
              color="white"
              textAlign={'center'}
            >
              THE STORY STARTS HERE
            </Heading>
          </Box>
        </Box>
        <Divider my={16} px={10} />
        <Box
          px={10}
          maxW={{ base: 'full', xl: '1440px' }}
          mx={'auto'}
          minH={'60vh'}
        >
          <Grid templateColumns={{ lg: '2fr 10fr' }} gap={5}>
            <Show above="lg">
              <GridItem pl={2} w="100%" h="10">
                <Stack>
                  <Text fontWeight={'bold'} fontSize={'2xl'} color={'black'}>
                    Filter
                  </Text>
                  <Box>
                    <Text
                      fontWeight={'semi-bold'}
                      fontSize={'lg'}
                      color={'gray.600'}
                    >
                      Category
                    </Text>
                    <Select
                      id="category-select"
                      ref={selectRef}
                      mt={3}
                      placeholder="Select category"
                      onChange={(e) => handleFilterCategory(e)}
                      value={categoryQuery}
                    >
                      {categoryList?.map((el: productCategory, idx: number) => (
                        <option key={idx} value={el.book_category_name}>
                          {el.book_category_name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Stack>
                <Stack mt={2}>
                  <Text fontWeight={'bold'} fontSize={'2xl'} color={'black'}>
                    Search
                  </Text>
                  <Box>
                    <InputGroup>
                      <InputRightElement pointerEvents="none">
                        <CiSearch color="gray.300" />
                      </InputRightElement>
                      <Input
                        type="tel"
                        placeholder="Book name"
                        onChange={(e) => handleSearch(e)}
                        value={search}
                      />
                    </InputGroup>
                  </Box>
                </Stack>
              </GridItem>
            </Show>
            {/* <Show below="md">
              <GridItem pl={2} w="100%" h="10" bg="blue.500">
                Tombol Filter
              </GridItem>
            </Show> */}
            <GridItem w="full" py={5} mx="auto">
              <Stack>
                <Flex justifyContent={'end'}>
                  <Select
                    width={'200px'}
                    mt={3}
                    placeholder="Sort by"
                    onChange={(e) => handleSort(e)}
                  >
                    <option value={'newest'}>Newest</option>
                    <option value={'highest'}>Highest Price</option>
                    <option value={'lowest'}>Lowest Price</option>
                  </Select>
                </Flex>
                {!products.length ? (
                  <Box bg={'aliceblue'}>
                    <Flex
                      minH={'300px'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      px={3}
                    >
                      Sorry, we could not find the book you are looking for.
                    </Flex>
                  </Box>
                ) : (
                  <ProductCard products={products} />
                )}
              </Stack>
            </GridItem>
          </Grid>
          <Paginate
            isPlaceholderData={isPlaceholderData}
            page={page}
            totalPages={res?.totalPages}
            handleClickButton={handleClickButton}
          />
        </Box>
      </Stack>
    </Box>
  );
}
