import { ReactNode } from 'react';
import { Navbar } from '../components/Navbar/Navbar';

export type SiteOuterLayoutProps = {
  children: ReactNode;
};

export const SiteOuterLayout = ({ children }: SiteOuterLayoutProps) => (
  <>
    <Navbar />
    {children}
  </>
);

export const getLayout = (page) => {
  return <SiteOuterLayout>{page}</SiteOuterLayout>;
};

export default SiteOuterLayout;
