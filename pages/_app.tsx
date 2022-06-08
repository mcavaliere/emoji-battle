import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { PageLayout } from '../components/PageLayout';
import { RoundProvider } from '../lib/context/RoundContext';

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
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <RoundProvider>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
          </RoundProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
export default MyApp;
