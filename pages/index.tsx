import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/client';
import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
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
    return (
      <Flex
        direction='column'
        width='100%'
        height='100vh'
        alignItems='center'
        justify='center'
      >
        <Heading size='3xl'>🤪 ⚔️ 😀</Heading>
        <Heading size='xl'>Emoji Battle</Heading>
        <Heading size='md' mb={20} textAlign='center'>
          Welcome to the Dojo.
        </Heading>
        <Button onClick={() => signIn()}>Sign in</Button>
        <Text mt={20}>Your name will be visible to others.</Text>
      </Flex>
    );
  }

  return (
    <Container maxW='100%' p={10}>
      <Heading mb={5} textAlign='center'>
        Emoji 🤪 ⚔️ 😀 Battle
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
