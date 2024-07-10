'use client';
import Paginate from '@/components/pagination/paginate';
import { AuthContext } from '@/context/Auth';
import { useProductCategory, useProductsName } from '@/hooks/useProduct';
import {
  useGetRevenueMonth,
  useGetTopSellingProduct,
  useReportStock,
  useReportStockOverview,
  useReportTransaction,
} from '@/hooks/useReport';
import { useListWarehouse } from '@/hooks/useWarehouse';
import {
  bookTopSell,
  productCategory,
  productNameList,
} from '@/interface/product.interface';
import { listWarehouseInterface } from '@/interface/warehouse.interface';
import {
  parseCurrency,
  parseDate,
  parseDateTime,
  separateStringHyphen,
} from '@/utils/convert';
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Rectangle,
} from 'recharts';

type customizedPieChart = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};
type transactionReportList = {
  id: number;
  status: 'on delivery' | 'completed';
  payment_method: string;
  transaction_revenue: number;
  warehouse_name: string;
  tDate: Date;
};
type stockReportList = {
  id: number;
  oldStock: number;
  newStock: number;
  stockChange: number;
  type: 'PLUS' | ' MINUS';
  created_at: Date;
  message: string;
  warehouseStock: warehouseStockInfo;
};

type warehouseStockInfo = {
  book: {
    book_name: string;
  };
  warehouse: {
    warehouse_name: string;
  };
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const userRole = user?.role;
  const [page, setPage] = useState(1);
  const [pageSR, setPageSR] = useState(1);
  const [categoryF, setCategoryF] = useState('');
  const [productF, setProductF] = useState('');
  const [warehouseF, setWarehouseF] = useState('');
  const [monthF, setMonthF] = useState('');
  const listMonthOption = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  const { data: revenue, isSuccess } = useGetRevenueMonth(
    categoryF,
    productF,
    warehouseF,
  );
  const { data: category } = useProductCategory();
  const listCategory: productCategory[] = category?.data.data || [];

  const { data: warehouses } = useListWarehouse();
  const listWarehouse: listWarehouseInterface[] = warehouses?.data.data || [];

  const { data: productNames } = useProductsName();
  const listProduct: productNameList[] = productNames?.data.data || [];

  const revenuePerMonth = revenue?.data || [];
  const dataRevenue = [
    { name: 'January', value: revenuePerMonth.janRevenue?.revenue },
    { name: 'February', value: revenuePerMonth.febRevenue?.revenue },
    { name: 'March', value: revenuePerMonth.marchRevenue?.revenue },
    { name: 'April', value: revenuePerMonth.aprilRevenue?.revenue },
    { name: 'May', value: revenuePerMonth.mayRevenue?.revenue },
    { name: 'June', value: revenuePerMonth.juneRevenue?.revenue },
    { name: 'July', value: revenuePerMonth.julyRevenue?.revenue },
  ];

  const { data: topSelling } = useGetTopSellingProduct(warehouseF, monthF);
  const listTopSelling: bookTopSell[] = topSelling?.data || [];

  const dataTopSell = listTopSelling.map((el) => ({
    name: el.book_name,
    value: Number(el.sold),
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: customizedPieChart) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const { data: trList, isPlaceholderData } = useReportTransaction(
    warehouseF,
    monthF,
    productF,
    categoryF,
    page,
  );
  const transactionList = trList?.data?.data?.revenuePerTransaction || [];
  const transactionTotalPage = trList?.data?.data?.totalPage || 0;
  const handleClickButton = (type: string): void => {
    if (type === 'next') {
      setPage((old: number) => old + 1);
    }
    if (type === 'prev') {
      setPage((old: number) => Math.max(old - 1, 1));
    }
  };

  //stock overview
  const { data: stockOverview } = useReportStockOverview(warehouseF, monthF);
  const overviewStockData = stockOverview?.data.data;
  const dataBar = Array(overviewStockData);
  const limitSR = 8;
  //stock report list
  const { data: stocked, isPlaceholderData: placeholderSR } = useReportStock(
    warehouseF,
    monthF,
    pageSR,
    limitSR,
  );
  const stockList: stockReportList[] = stocked?.data.data.report || [];
  const stockListPages = stocked?.data?.data?.totalPages;
  //modal see detail stock journal report
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detailMsg, setDetalMsg] = useState('');
  const handleSeeDetailMessage = (msg: string) => {
    setDetalMsg(msg);
    onOpen();
  };

  const handlePaginateSR = (type: string): void => {
    if (type === 'next') {
      setPageSR((old: number) => old + 1);
    }
    if (type === 'prev') {
      setPageSR((old: number) => Math.max(old - 1, 1));
    }
  };
  return (
    <Stack gap={50} p={20}>
      <Flex justifyContent={'space-between'}>
        <Box p={15} my={25}>
          <Heading size={'4xl'}>Dashboard Report</Heading>
        </Box>
        <Box px={5} py={10}>
          {userRole === 'super admin' && (
            <Select
              border={'1px solid black'}
              variant={'outline'}
              size={'lg'}
              placeholder="All Warehouses"
              w={300}
              onChange={(e) =>
                setWarehouseF(separateStringHyphen(e.target.value))
              }
            >
              {listWarehouse.map((el) => (
                <option key={el.id} value={el.warehouse_name}>
                  {el.warehouse_name}
                </option>
              ))}
            </Select>
          )}
        </Box>
      </Flex>
      <Box bgColor={'whiteAlpha'}>
        <Flex gap={8}>
          <Select
            border={'1px solid black'}
            variant={'outline'}
            size={'md'}
            placeholder="All categories"
            w={200}
            onChange={(e) => setCategoryF(e.target.value)}
          >
            {listCategory.map((el) => (
              <option key={el.id} value={el.book_category_name}>
                {el.book_category_name}
              </option>
            ))}
          </Select>
          <Select
            variant={'outline'}
            border={'1px solid black'}
            size={'md'}
            placeholder="All Products"
            w={200}
            onChange={(e) => setProductF(e.target.value)}
          >
            {listProduct.map((el) => (
              <option key={el.id} value={el.book_name}>
                {el.book_name}
              </option>
            ))}
          </Select>
          <Select
            variant={'outline'}
            border={'1px solid black'}
            size={'md'}
            placeholder="All months"
            w={200}
            onChange={(e) => setMonthF(e.target.value)}
          >
            {listMonthOption.map((month, idx) => (
              <option key={idx} value={month}>
                {month}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>
      <Heading size={'2xl'}>Sales Report</Heading>
      <SimpleGrid columns={2} gap={35}>
        <Box bgColor={'#F7F9F2'} pt={20}>
          <Heading size={'2xl'} textAlign={'center'}>
            Revenue
          </Heading>
          <Box mt={5} height="80%" p={10}>
            {isSuccess ? (
              <ResponsiveContainer width="100%" height="80%">
                <LineChart
                  width={500}
                  height={300}
                  data={dataRevenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 35,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend iconType={'wye'} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F39324"
                    name="Total Revenue"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              ''
            )}
          </Box>
        </Box>
        <Box bgColor={'#F7F9F2'} p={15}>
          <Heading size={'xl'} textAlign={'center'} mt={15} mb={25}>
            Top Selling Product
          </Heading>
          {listTopSelling ? (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart width={400} height={400}>
                <Pie
                  data={dataTopSell}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataTopSell.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Heading
              textAlign={'center'}
              size={'lg'}
              color={'orange'}
              bg={'white'}
            >
              No data
            </Heading>
          )}
        </Box>
      </SimpleGrid>
      <Box>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Transaction ID</Th>
                <Th>Status</Th>
                <Th>Payment Method</Th>
                <Th>Warehouse</Th>
                <Th>Date</Th>
                <Th isNumeric>Value Transaction</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionList.length ? (
                transactionList.map((tr: transactionReportList) => (
                  <Tr key={tr.id}>
                    <Td>{tr?.id}</Td>
                    <Td>{tr?.status}</Td>
                    <Td>{tr.payment_method}</Td>
                    <Td>{tr.warehouse_name}</Td>
                    <Td>{parseDate(tr.tDate)}</Td>
                    <Td isNumeric> {parseCurrency(tr.transaction_revenue)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td textAlign={'center'} colSpan={100}>
                    No data found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          {transactionList.length > 0 && (
            <Paginate
              isPlaceholderData={isPlaceholderData}
              page={page}
              totalPages={transactionTotalPage}
              handleClickButton={handleClickButton}
            />
          )}
        </TableContainer>
      </Box>
      <Box>
        <Heading size={'2xl'} my={10}>
          Stock Report
        </Heading>
        <Box height={'500px'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={dataBar}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="stockPlus"
                name={'Stock Plus'}
                fill="#82ca9d"
                activeBar={<Rectangle fill="green" stroke="#9BEC00" />}
              />
              <Bar
                dataKey="stockMinus"
                name={'Stock Minus'}
                fill="#C80036"
                activeBar={<Rectangle fill="red" stroke="#FF6969" />}
              />
              <Bar
                name={'Final Stock'}
                dataKey="finalStock"
                fill="#00000"
                activeBar={<Rectangle fill="white" stroke="silver" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box mt={10}>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Book Name</Th>
                  <Th>Warehouse</Th>
                  <Th isNumeric>Old stock</Th>
                  <Th isNumeric>Stock Change</Th>
                  <Th isNumeric>New Stock</Th>
                  <Th>Type</Th>
                  <Th>DateTime</Th>
                  <Th>Detail</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stockList.length ? (
                  stockList?.map((stock) => (
                    <Tr key={stock.id}>
                      <Td>{stock.warehouseStock?.book?.book_name}</Td>
                      <Td>{stock.warehouseStock?.warehouse?.warehouse_name}</Td>
                      <Td isNumeric>{stock.oldStock}</Td>
                      <Td isNumeric>{stock.stockChange}</Td>
                      <Td isNumeric>{stock.newStock}</Td>
                      <Td color={stock.type === 'PLUS' ? 'green' : 'red'}>
                        {stock.type === 'PLUS' ? 'Addition' : 'Subtraction'}
                      </Td>
                      <Td>{parseDateTime(stock.created_at)}</Td>
                      <Td>
                        <Button
                          variant={'outline'}
                          colorScheme="orange"
                          onClick={() => handleSeeDetailMessage(stock?.message)}
                        >
                          See detail
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td textAlign={'center'} colSpan={100}>
                      No data found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Paginate
            totalPages={stockListPages}
            handleClickButton={handlePaginateSR}
            page={pageSR}
            isPlaceholderData={placeholderSR}
          />
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stock Jurnal Detail Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{detailMsg}</ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
