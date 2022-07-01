import React from 'react';
import { Heading, Center } from '@chakra-ui/react';

export type MyComponentProps = {
  // Add props here.
  myProp: string;
}

/** Description of component */
export function MyComponent({ myProp }: MyComponentProps): JSX.Element {
  const message = 'MyComponent Created.';

  return (
    <Center bg="red.300" color="white" padding={{ base: 16, lg: 24 }}>
      <Heading>{message}</Heading>
    </Center>
  );
};