'use client';
import { AuthContext } from '@/context/Auth';
import { useProductCategory, useProductsName } from '@/hooks/useProduct';
import { useGetRevenueMonth, useGetTopSellingProduct } from '@/hooks/useReport';
import { useListWarehouse } from '@/hooks/useWarehouse';
import {
  productCategory,
  productNameList,
} from '@/interface/product.interface';
import { listWarehouseInterface } from '@/interface/warehouse.interface';
import { Box, Flex, Heading, Select, SimpleGrid } from '@chakra-ui/react';
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
} from 'recharts';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const userRole = user?.role;
  const [categoryF, setCategoryF] = useState('');
  const [productF, setProductF] = useState('');
  const [warehouseF, setWarehouseF] = useState(0);
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
  ];

  const { data: topSelling, isSuccess: isTopSellFetched } =
    useGetTopSellingProduct();
  const listTopSelling = topSelling?.data || [];

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
  }) => {
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

  return (
    <Box h={'100vh'}>
      <Box p={15} my={25}>
        <Heading size={'4xl'}>Sales Report</Heading>
      </Box>
      <SimpleGrid columns={2} h={'50%'} gap={35}>
        <Box bgColor={'#F7F9F2'}>
          <Heading size={'xl'} textAlign={'center'} mt={15} mb={25}>
            Revenue Store
          </Heading>
          <Flex gap={8} pl={30}>
            <Select
              border={'1px solid black'}
              variant={'outline'}
              size={'sm'}
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
              size={'sm'}
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
            {userRole === 'super admin' && (
              <Select
                border={'1px solid black'}
                variant={'outline'}
                size={'sm'}
                placeholder="All Warehouses"
                w={200}
                onChange={(e) => setWarehouseF(Number(e.target.value))}
              >
                {listWarehouse.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.warehouse_name}
                  </option>
                ))}
              </Select>
            )}
          </Flex>
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
          {isTopSellFetched && (
            <ResponsiveContainer width="100%" height="80%">
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
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
