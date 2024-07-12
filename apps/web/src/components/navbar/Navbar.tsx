'use client';
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useContext } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import Logo from '../logo/logo';
import { AuthContext } from '@/context/Auth';

export default function Navbar() {
  const bg = useColorModeValue('white', 'gray.800');
  const mobileNav = useDisclosure();
  const { user, useLogout: UseLogout } = useContext(AuthContext);

  const handleLogout = () => {
    UseLogout();
    sessionStorage.clear();
  };

  const authNavbar = () => {
    if (!user) {
      return (
        <>
          <Link href="/login">
            <Button w="full" variant="ghost">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button w="full" variant="ghost">
              Sign up
            </Button>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link href="/cart">
            <Button w="full" variant="ghost">
              Cart
            </Button>
          </Link>
          <Link href="/transaction-history">
            <Button w="full" variant="ghost">
              Transaction
            </Button>
          </Link>
          <Link href="/login" onClick={() => handleLogout()}>
            <Button w="full" variant="ghost">
              Log out
            </Button>
          </Link>
        </>
      );
    }
  };

  return (
    <React.Fragment>
      <chakra.header
        bg={bg}
        w="full"
        px={{
          base: 2,
          sm: 4,
        }}
        py={4}
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <Link href="/" title="Librairie Home Page">
              <Logo w={65} h={65} />
            </Link>
          </Flex>
          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={1}
              mr={1}
              color="brand.500"
              display={{
                base: 'none',
                md: 'inline-flex',
              }}
            >
              <Link href={'/product'}>
                <Button variant="ghost">Product</Button>
              </Link>
              {/* 
              <Link href={'/login'}>
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href={'/register'}>
                <Button variant="ghost">Sign up</Button>
              </Link> */}
              {authNavbar()}
            </HStack>
            <Button colorScheme="brand" size="sm">
              Get Started
            </Button>
            <Box
              display={{
                base: 'inline-flex',
                md: 'none',
              }}
            >
              <IconButton
                display={{
                  base: 'flex',
                  md: 'none',
                }}
                aria-label="Open menu"
                fontSize="20px"
                color="gray.800"
                _dark={{
                  color: 'inherit',
                }}
                variant="ghost"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />

              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? 'flex' : 'none'}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <CloseButton
                  aria-label="Close menu"
                  onClick={mobileNav.onClose}
                />
                <Link href={'/product'}>
                  <Button w="full" variant="ghost">
                    Product
                  </Button>
                </Link>
                {/* <Link href="/login">
                  <Button w="full" variant="ghost">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button w="full" variant="ghost">
                    Sign up
                  </Button>
                </Link> */}
                {authNavbar()}
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}
