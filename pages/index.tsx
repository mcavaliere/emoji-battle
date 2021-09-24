import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/client';
import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';

import { EmojiGrid } from '../components/EmojiGrid';
import { EmojiPicker } from '../components/EmojiPicker';
import { UserList } from '../components/UserList';

// @ts-ignore
const Home: NextPage = () => {
  const [session, loading] = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }

  return (
    <Container maxW='100%'>
      <Heading mb={5} textAlign='center'>
        Emoji Battle
      </Heading>

      {session?.user?.name && (
        <Heading size='md' mb={20} textAlign='center'>
          Welcome to the Dojo, {session?.user?.name}.
        </Heading>
      )}

      <HStack spacing={20} alignItems='flex-start'>
        <EmojiPicker />
        <EmojiGrid />
        <UserList />
      </HStack>
    </Container>
  );
};

export default Home;
