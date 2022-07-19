import { ReactElement, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
