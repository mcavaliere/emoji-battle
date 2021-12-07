import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { PageLayout } from '../components/PageLayout';
import { SWRConfig } from 'swr';

const swrConfig = {
  refreshInterval: 0,
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={swrConfig}>
        <ChakraProvider>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </ChakraProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
export default MyApp;
