import React from 'react';
import { Box, Heading, Center, Flex, VStack, Link } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { NavbarAvatar } from '../NavbarAvatar/NavbarAvatar';

export function Navbar(): JSX.Element | null {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // Only show Navbar when logged in.
  if (loading || !session) {
    return null;
  }

  const name = session?.user?.name || undefined;
  const src = session?.user?.image || undefined;

  return (
    <Flex direction="row" padding={{ base: 3, lg: 5 }} justify="space-between">
      <Box>
        <Link href="https://github.com/mcavaliere/emoji-battle">
          <FaGithub size={30} />
        </Link>
      </Box>
      <Center>
        <VStack>
          <Heading size="md">Emoji 🤪 ⚔️ 😀 Battle</Heading>
          <Heading size="sm">Welcome to the dojo.</Heading>
        </VStack>
      </Center>
      <Flex direction="row" align="center">
        <NavbarAvatar name={name} src={src} />
      </Flex>
    </Flex>
  );
}
