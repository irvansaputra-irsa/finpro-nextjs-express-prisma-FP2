import React from 'react';
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  CardFooter,
  SimpleGrid,
  Container,
} from '@chakra-ui/react';

const Product = () => {
  const products = [
    {
      id: 1,
      title: 'Buku Pemrograman JavaScript',
      description:
        'Panduan lengkap untuk mempelajari JavaScript dari dasar hingga mahir.',
      price: 'Rp. 150.000,-',
      imageUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHx8&dpr=2',
    },
    {
      id: 2,
      title: 'Buku Pemrograman Python',
      description:
        'Panduan komprehensif untuk pemrograman Python, cocok untuk pemula dan profesional.',
      price: 'Rp. 120.000,-',
      imageUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHx8&dpr=2',
    },
    {
      id: 3,
      title: 'Buku Pemrograman React',
      description:
        'Pelajari cara membuat aplikasi web interaktif dengan React.',
      price: 'Rp. 170.000,-',
      imageUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHx8&dpr=2',
    },
    {
      id: 4,
      title: 'Buku Pemrograman Node.js',
      description:
        'Panduan praktis untuk membangun aplikasi backend dengan Node.js.',
      price: 'Rp. 180.000,-',
      imageUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHx8&dpr=2',
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <SimpleGrid columns={[1, null, 2, 4]} spacing="40px">
        {products.map((product) => (
          <Card key={product.id} maxW="xs" shadow="xl">
            <CardBody>
              <Image
                src={product.imageUrl}
                alt={product.title}
                borderRadius="lg"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md">{product.title}</Heading>
                <Text noOfLines={4}>{product.description}</Text>
                <Text color="blue.600" fontSize="lg" mt={5} textAlign="center">
                  {product.price}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing="2" m="auto">
                <Button variant="solid" colorScheme="blue">
                  Buy now
                </Button>
                <Button variant="ghost" colorScheme="blue">
                  Add to cart
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Product;
