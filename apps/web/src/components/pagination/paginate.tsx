import { Button, Flex, Icon } from '@chakra-ui/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import React from 'react';
import { paginate } from '@/interface/paginate.interface';

export type PagButton = {
  handleClick?: any;
  disabled?: boolean;
  active?: boolean;
  p?: boolean;
  children: React.ReactNode;
};

function Paginate({
  isPlaceholderData,
  page,
  totalPages,
  handleClickButton,
}: paginate) {
  const PagButton = (props: PagButton) => {
    const activeStyle = {
      bg: 'brand.600',
      _dark: {
        bg: 'brand.500',
      },
      color: 'white',
    };
    return (
      <Button
        mx={1}
        px={4}
        py={2}
        rounded="md"
        bg="white"
        _dark={{
          bg: 'gray.800',
        }}
        isDisabled={props.disabled}
        color="gray.700"
        opacity={props.disabled ? 0.6 : undefined}
        _hover={!props.disabled ? activeStyle : undefined}
        cursor={props.disabled ? 'not-allowed' : undefined}
        {...(props.active && activeStyle)}
        display={
          props.p && !props.active
            ? {
                base: 'none',
                sm: 'block',
              }
            : undefined
        }
        onClick={props.handleClick && (() => props.handleClick())}
      >
        {props.children}
      </Button>
    );
  };
  return (
    <Flex
      bg="#edf3f8"
      _dark={{
        bg: '#3e3e3e',
      }}
      p={50}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Flex>
        <PagButton
          disabled={page === 1}
          handleClick={() => handleClickButton('prev')}
        >
          <Icon
            as={IoIosArrowBack}
            color="gray.700"
            _dark={{
              color: 'gray.200',
            }}
            boxSize={4}
          />
        </PagButton>
        <PagButton p active>
          {page}
        </PagButton>
        <PagButton
          disabled={isPlaceholderData || page === totalPages}
          handleClick={() => handleClickButton('next')}
        >
          <Icon
            as={IoIosArrowForward}
            color="gray.700"
            _dark={{
              color: 'gray.200',
            }}
            boxSize={4}
          />
        </PagButton>
      </Flex>
    </Flex>
  );
}

export default Paginate;
