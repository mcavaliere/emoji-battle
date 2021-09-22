import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}
export default MyApp;
