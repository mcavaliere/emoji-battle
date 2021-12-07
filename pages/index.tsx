import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';

import * as Constants from '../lib/websocketConstants';
import { Leaderboard } from '../components/Leaderboard';
import { EmojiPicker } from '../components/EmojiPicker';
import { UserList } from '../components/UserList';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import { useEffect } from 'react';

const handleResetClick = async () => {
  await fetch('/api/reset', { method: 'POST' });
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [playersChannel] = useWebsocketChannel(
    Constants.CHANNELS.PLAYERS,
    () => {}
  );

  useEffect((): void => {
    if (session?.user) {
      // @ts-ignore
      playersChannel.publish(Constants.EVENTS.PLAYER_JOINED, session.user);
    }
  }, [session?.user]);

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
        <>
          <Heading size='md' mb={20} textAlign='center'>
            Welcome to the Dojo, {session?.user?.name}.
          </Heading>
          <Box position='absolute' top={10} right={10}>
            <HStack>
              {session?.user?.name === 'Mike Cavaliere' && (
                <Button onClick={handleResetClick}>Reset Game</Button>
              )}
              <Button onClick={() => signOut()}>Sign out</Button>
            </HStack>
          </Box>
        </>
      )}

      <SimpleGrid columns={3} spacing={3}>
        <EmojiPicker />
        <Leaderboard />
        <UserList />
      </SimpleGrid>
    </Container>
  );
};

export default Home;
