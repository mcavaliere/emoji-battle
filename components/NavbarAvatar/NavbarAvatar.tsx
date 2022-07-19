import React from 'react';
import { Avatar, VStack, Link, Text } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';

export type NavbarAvatarProps = {
  name?: string | undefined;
  src?: string | undefined;
};

/** Description of component */
export function NavbarAvatar({
  name = 'Anonymous',
  src = undefined,
}: NavbarAvatarProps): JSX.Element | null {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // Only show Navbar when logged in.
  if (loading || !session) {
    return null;
  }

  return (
    <>
      <Avatar size="sm" name={name} src={src} mr={2} />

      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={0}
        display={{ base: 'none', md: 'flex' }}
      >
        <Text size="sm">{name}</Text>
        <Link fontSize="xs" onClick={() => signOut()}>
          Sign out
        </Link>
      </VStack>
    </>
  );
}
