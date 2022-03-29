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
    start: startRound,
    end: endRound,
    reset: resetRound,
    inProgress: roundIsInProgress,
    timerStarted,
    currentStep,
    startedAt: roundCreatedAt,
    endedAt: roundEndedAt,
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
      {roundIsInProgress ? (
        <Box position="absolute" top={10} left={10}>
          <CountdownTimer max={Constants.ROUNDS.DURATION} count={currentStep} />
        </Box>
      ) : null}

      <LoggedInBranding name={session?.user?.name} />

      <Box position="absolute" top={10} right={10}>
        <HStack>
          {/* {session?.user?.name === 'Mike Cavaliere' && (
            <Button onClick={handleResetClick}>Reset Game</Button>
          )} */}

          {!roundIsInProgress ? (
            <Button bg="green.200" onClick={() => startRound!()}>
              Start Round
            </Button>
          ) : null}
          {/* <Button bg="red.200" onClick={() => endRound!()}>
            End Round
          </Button> */}
          {/* <Button bg="yellow.200" onClick={() => resetRound!()}>
            Reset
          </Button> */}

          <Button onClick={() => signOut()}>Sign out</Button>
        </HStack>
      </Box>

      {roundIsInProgress ? (
        <SimpleGrid columns={3} spacing={3}>
          <Container textAlign="center">
            <EmojiPicker />
          </Container>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            m={0}
            width="100%"
          >
            <Leaderboard />
          </Flex>
          <Container textAlign="center">
            <UserList />
          </Container>
        </SimpleGrid>
      ) : null}
    </Container>
  );
};

export default Home;
