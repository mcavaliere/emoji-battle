import { ReactNode } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import Head from 'next/head';

export type SiteOuterLayoutProps = {
  children: ReactNode;
};

export const SiteOuterLayout = ({ children }: SiteOuterLayoutProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
    </Head>
    <Navbar />
    {children}
  </>
);

export const getLayout = (page) => {
  return <SiteOuterLayout>{page}</SiteOuterLayout>;
};

export default SiteOuterLayout;
