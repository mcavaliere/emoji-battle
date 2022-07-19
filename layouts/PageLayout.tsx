import { Container, Flex } from '@chakra-ui/react';
import { getLayout as getSiteLayout } from './SiteOuterLayout';

export const PageLayout = ({ children }) => (
  <Container
    maxW="100%"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minH="100vh"
    width="100%"
  >
    {children}
  </Container>
);

export const getLayout = (page) =>
  getSiteLayout(<PageLayout>{page}</PageLayout>);
