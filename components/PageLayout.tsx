import { Flex } from '@chakra-ui/react';

export const PageLayout = ({ children }) => (
  <Flex align='center' justify='center' minH='100vh' width='100%'>
    {children}
  </Flex>
);
