import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { theme } from '../lib/theme/theme';
import { RoundProvider } from '../lib/context/round/RoundContext';
import { EmojisProvider } from '../lib/context/emojis/EmojisProvider';

import { AppPropsWithLayout } from '../lib/types/NextApp';
import { getLayout as defaultGetLayout } from '../layouts/PageLayout';

// Checks for required environment variables.
if (typeof window === 'undefined') {
  if (!process.env.API_BASE_URL) {
    throw new Error('API_BASE_URL is not set.');
  }
} else {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60,
    },
  },
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Grab the layout if set; otherwise default to the default layout.
  const getLayout = Component.getLayout || defaultGetLayout;

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <RoundProvider>
            <EmojisProvider>
              {getLayout(<Component {...pageProps} />, pageProps)}
            </EmojisProvider>
          </RoundProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
export default MyApp;
