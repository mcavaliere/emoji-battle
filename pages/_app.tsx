import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { ChakraProvider } from '@chakra-ui/react';
import { PageLayout } from '../components/PageLayout';
import { SWRConfig } from 'swr';

const swrConfig = {
  refreshInterval: 0,
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider session={session}>
      <SWRConfig value={swrConfig}>
        <ChakraProvider>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </ChakraProvider>
      </SWRConfig>
    </Provider>
  );
}
export default MyApp;
