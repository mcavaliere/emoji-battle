import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: 'gray.100',
      },
      '*': {
        // Disable double-tap on mobile, since it prevents people from tapping.
        'touch-action': 'manipulation',
      },
    }),
  },
});
