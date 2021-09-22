import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { ChakraProvider } from '@chakra-ui/react';
import { PageLayout } from '../components/PageLayout';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider session={session}>
      <ChakraProvider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ChakraProvider>
    </Provider>
  );
}
export default MyApp;
