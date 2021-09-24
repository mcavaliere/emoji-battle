import { Container, Flex } from '@chakra-ui/react';

export const PageLayout = ({ children }) => (
  <Container
    maxW='100%'
    direction='column'
    align='center'
    justify='center'
    minH='100vh'
    width='100%'
  >
    {children}
  </Container>
);
