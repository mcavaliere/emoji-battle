import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: 'gray.100',
      },
    }),
  },
});
