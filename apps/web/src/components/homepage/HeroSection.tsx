import {
  Flex,
  VStack,
  Text,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';

export default function HeroSection() {
  const pxValue = useBreakpointValue({ base: 4, md: 8 });
  const fontSizeValue = useBreakpointValue({ base: '3xl', md: '4xl' });

  return (
    <Flex
      w="full"
      h="100vh"
      backgroundImage="url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)"
      backgroundSize="cover"
      backgroundPosition="center center"
    >
      <VStack
        w="full"
        justify="center"
        px={pxValue}
        textAlign="center"
        mt="20vh"
      >
        <VStack maxW="2xl" spacing={6} color="white">
          <Text fontWeight={700} lineHeight={1.2} fontSize={fontSizeValue}>
            Temukan Buku Terbaik untuk Setiap Jelajah
          </Text>
          <Text>
            Buka dunia baru dengan koleksi buku kami yang luas. Temukan berbagai
            genre dan penulis terkenal.
          </Text>
          <Button
            bgGradient="linear(to-r, blue.400, blue.600)"
            rounded="full"
            color="white"
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
            boxShadow="lg"
            px={8}
            py={4}
            fontSize="xl"
          >
            Jelajahi Sekarang
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
}
