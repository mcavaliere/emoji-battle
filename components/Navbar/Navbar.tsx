import React from 'react';
import { Heading, Center, VStack } from '@chakra-ui/react';

export function Navbar(): JSX.Element {
  return (
    <Center
      bg="green.100"
      padding={{ base: 3, lg: 5 }}
      display={{ base: 'flex' }}
    >
      <VStack>
        <Heading size="md">Emoji 🤪 ⚔️ 😀 Battle</Heading>
        <Heading size="sm">🥋Welcome to the dojo.</Heading>
      </VStack>
    </Center>
  );
}
