'use client';
import SidebarContent from '@/components/navbar/Sidebar';
import {
  Avatar,
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { FiMenu, FiSearch } from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useDisclosure();
  return (
    <>
      <Box
        as="section"
        bg="gray.50"
        _dark={{
          bg: 'gray.700',
        }}
        minH="100vh"
      >
        <SidebarContent
          display={{
            base: 'none',
            md: 'unset',
          }}
        />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box
          ml={{
            base: 0,
            md: 60,
          }}
          transition=".3s ease"
        >
          <Flex
            as="header"
            align="center"
            justify={{ base: 'space-between', md: 'end' }}
            w="full"
            px="4"
            bg="white"
            _dark={{
              bg: 'gray.800',
            }}
            borderBottomWidth="1px"
            color="inherit"
            h="14"
          >
            <IconButton
              aria-label="Menu"
              display={{
                base: 'inline-flex',
                md: 'none',
              }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
            <Flex align="center">
              <Icon color="gray.500" as={FaBell} cursor="pointer" />
              <Avatar
                ml="4"
                size="sm"
                name="anubra266"
                src="https://avatars.githubusercontent.com/u/30869823?v=4"
                cursor="pointer"
              />
            </Flex>
          </Flex>

          <Box as="main" p="4">
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
}
