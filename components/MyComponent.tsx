import React from 'react';
import { Heading, Center } from '@chakra-ui/react';

/** Description of component */
export function MyComponent() {
  const message = 'Hola! MyComponent Created!';

  return (
    <Center bg="red.300" color="white" padding={{ base: 16, lg: 24 }}>
      <Heading>{message}</Heading>
    </Center>
  );
};