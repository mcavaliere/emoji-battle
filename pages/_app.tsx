import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import { PageLayout } from '../components/PageLayout';
import { RoundProvider } from '../lib/context/RoundContext';

const swrConfig = {
  refreshInterval: 0,
};

// Checks for required environment variables.
if (typeof window === 'undefined') {
  if (!process.env.API_BASE_URL) {
    throw new Error("API_BASE_URL is not set.")
  }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={swrConfig}>
        <ChakraProvider>
          <RoundProvider>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
          </RoundProvider>
        </ChakraProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
export default MyApp;
