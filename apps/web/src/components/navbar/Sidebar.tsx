'use client';
import {
  Box,
  BoxProps,
  Collapse,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillProduct } from 'react-icons/ai';
import { FaWarehouse } from 'react-icons/fa';
import { BiSolidLogOut } from 'react-icons/bi';
import { MdHome, MdKeyboardArrowRight, MdInventory } from 'react-icons/md';
import { GrTransaction } from 'react-icons/gr';
import { RiUserSettingsFill } from 'react-icons/ri';
import Logo from '../logo/logo';
import { PropsWithChildren, useContext } from 'react';
import { IconType } from 'react-icons';
import Link from 'next/link';
import { AuthContext } from '@/context/Auth';
import { useRouter } from 'next/navigation';

const SidebarContent = (props: BoxProps) => {
  const { useLogout: UseLogout, user } = useContext(AuthContext);
  const userRole = user?.role;
  const router = useRouter();
  const integrationsProduct = useDisclosure();
  const integrationsInventory = useDisclosure();
  const integrationsWarehouse = useDisclosure();
  const color = useColorModeValue('gray.600', 'gray.300');

  const logout = () => {
    UseLogout();
    router.push('/login');
  };

  type FooProps = {
    icon?: IconType;
    onClick?: () => void;
    pl?: string;
    py?: string;
  };

  const NavItem = (props: PropsWithChildren<FooProps>) => {
    const { icon, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{
          color: 'gray.400',
        }}
        _hover={{
          bg: 'gray.100',
          _dark: {
            bg: 'gray.900',
          },
          color: 'gray.900',
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      border={'solid black 1px'}
      color="inherit"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex maxW={'full'} w={'100%'} pt="5" justifyContent={'center'}>
        <Logo w={80} h={80} />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <Link href={'/dashboard'}>
          <NavItem icon={MdHome}>Home</NavItem>
        </Link>
        <NavItem icon={AiFillProduct} onClick={integrationsProduct.onToggle}>
          Product
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={
              (integrationsProduct?.isOpen && 'rotate(90deg)') || undefined
            }
          />
        </NavItem>
        <Collapse in={integrationsProduct.isOpen}>
          <Link href={'/dashboard/product-list'}>
            <NavItem pl="12" py="2">
              Product Item
            </NavItem>
          </Link>
          <Link href={'/dashboard/product-category-list'}>
            <NavItem pl="12" py="2">
              Product Category
            </NavItem>
          </Link>
        </Collapse>
        <Link href={'/dashboard/admin-transaction'}>
          <NavItem icon={GrTransaction}>Order</NavItem>
        </Link>

        <NavItem icon={MdInventory} onClick={integrationsInventory.onToggle}>
          Inventory
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={
              (integrationsInventory?.isOpen && 'rotate(90deg)') || undefined
            }
          />
        </NavItem>
        <Collapse in={integrationsInventory.isOpen}>
          <Link href={'/dashboard/stock-management'}>
            <NavItem pl="12" py="2">
              Stock Management
            </NavItem>
          </Link>
          <Link href={'/dashboard/stock-mutation'}>
            <NavItem pl="12" py="2">
              Stock Mutation
            </NavItem>
          </Link>
        </Collapse>
        {userRole === 'super admin' && (
          <>
            <NavItem icon={RiUserSettingsFill}>Admin Management</NavItem>
            <NavItem
              icon={FaWarehouse}
              onClick={integrationsWarehouse.onToggle}
            >
              Warehouse
              <Icon
                as={MdKeyboardArrowRight}
                ml="auto"
                transform={
                  (integrationsWarehouse?.isOpen && 'rotate(90deg)') ||
                  undefined
                }
              />
            </NavItem>
            <Collapse in={integrationsWarehouse.isOpen}>
              <NavItem pl="12" py="2">
                Warehouse Management
              </NavItem>
              <NavItem pl="12" py="2">
                Warehouse Admin
              </NavItem>
            </Collapse>
          </>
        )}

        <NavItem icon={BiSolidLogOut} onClick={() => logout()}>
          Logout
        </NavItem>
      </Flex>
    </Box>
  );
};

export default SidebarContent;
