import type { NextPage } from 'next';
import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  Box,
  Button,
  HStack,
  Container,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';

import * as Constants from '../lib/websocketConstants';
import { CountdownTimer } from '../components/CountdownTimer';
import { Leaderboard } from '../components/Leaderboard';
import { EmojiPicker } from '../components/EmojiPicker';
import { RoundSummary } from '../components/RoundSummary';
import { UserList } from '../components/UserList';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import { useRoundContext } from '../lib/context/RoundContext';
import { LoggedInBranding, LoggedOutBranding } from '../components/Branding';

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

  const {
    round: currentRound,
    start: startRound,
    end: endRound,
    reset: resetRound,
    inProgress: roundIsInProgress,
    currentStep,
  } = useRoundContext();


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
        direction="column"
        width="100%"
        height="100vh"
        alignItems="center"
        justify="center"
      >
        <LoggedOutBranding />
        <Button onClick={() => signIn()}>Sign in</Button>
        <Text mt={20}>Your name and avatar will be visible to others.</Text>
      </Flex>
    );
  }

  return (
    <Container maxW="100%" p={10}>
      <SimpleGrid spacing={3} columns={3}>
        <Box>
          {roundIsInProgress ? (
            <CountdownTimer
              max={Constants.ROUNDS.DURATION}
              count={currentStep}
            />
          ) : null}
        </Box>

        <LoggedInBranding name={session?.user?.name} />

        <Box position="absolute" top={10} right={10}>
          <HStack>
            {!roundIsInProgress ? (
              <Button bg="green.200" onClick={() => startRound!()}>
                Start Round
              </Button>
            ) : null}

            <Button onClick={() => signOut()}>Sign out</Button>
          </HStack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={3} spacing={3}>
        <Container textAlign="center">
          {roundIsInProgress ? <EmojiPicker /> : null}
        </Container>
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          m={0}
          width="100%"
        >
          {roundIsInProgress ? (
            <Leaderboard />
          ) : currentRound?.endedAt ? (
            <RoundSummary />
          ) : null}
        </Flex>
        <Container textAlign="center">
          <UserList />
        </Container>
      </SimpleGrid>
    </Container>
  );
};

export default Home;
