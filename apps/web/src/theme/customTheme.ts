'use client';
// 1. Import `extendTheme`
import { extendTheme } from '@chakra-ui/react';
import '@fontsource/lato';
import '@fontsource/inter';

// 2. Call `extendTheme` and pass your custom values
const customTheme = extendTheme({
  fonts: {
    heading: `'Lato', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

export default customTheme;
