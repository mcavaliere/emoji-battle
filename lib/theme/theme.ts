import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: 'gray.100',
        // Disable zooming on mobile, since it degrades the experience.
        'touch-action': 'pan-x pan-y',
      },
    }),
  },
});
