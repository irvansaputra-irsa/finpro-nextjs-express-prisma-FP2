import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

const PageWrapper = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <Box>{children}</Box>;
};

export default PageWrapper;
