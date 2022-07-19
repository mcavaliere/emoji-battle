import React from 'react';
import {
  Avatar,
  Box,
  Heading,
  Center,
  Flex,
  VStack,
  Text,
  Link,
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar(): JSX.Element | null {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // Only show Navbar when logged in.
  if (loading || !session) {
    return null;
  }

  const name = session?.user?.name || 'Anonymous';
  const src = session?.user?.image || undefined;

  return (
    <Flex
      direction="row"
      bg="green.100"
      padding={{ base: 3, lg: 5 }}
      justify="space-between"
    >
      <Box></Box>
      <Center>
        <VStack>
          <Heading size="md">Emoji 🤪 ⚔️ 😀 Battle</Heading>
          <Heading size="sm">Welcome to the dojo.</Heading>
        </VStack>
      </Center>
      <Flex direction="row" align="center">
        <Avatar size="sm" name={name} src={src} mr={2} />
        <VStack alignItems="flex-start" justifyContent="flex-start" spacing={0}>
          <Text size="sm">{name}</Text>
          <Link fontSize="xs" onClick={() => signOut()}>
            Sign out
          </Link>
        </VStack>
      </Flex>
    </Flex>
  );
}
