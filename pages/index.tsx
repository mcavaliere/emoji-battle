import type { NextPage } from 'next';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

import * as Constants from '../lib/websocketConstants';
import { CountdownTimer } from '../components/CountdownTimer/CountdownTimer';
import { LeaderboardContainer } from '../components/Leaderboard/Leaderboard';
import { EmojiPicker } from '../components/EmojiPicker/EmojiPicker';
import { RoundSummary } from '../components/RoundSummary/RoundSummary';
import { UserList } from '../components/UserList/UserList';
import { useWebsocketChannels } from '../lib/hooks/useWebsocketChannels';
import { useRoundContext } from '../lib/context/RoundContext';

import {
  LoggedInBranding,
  LoggedOutBranding,
} from '../components/Branding/Branding';

const handleResetClick = async () => {
  await fetch('/api/reset', { method: 'POST' });
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const { playersChannel } = useWebsocketChannels();

  const {
    previousRound,
    start: startRound,
    inProgress: roundIsInProgress,
    hideRoundSummary,
    roundSummaryVisible,
    currentStep,
  } = useRoundContext();

  useEffect((): void => {
    if (session?.user) {
      // TODO: lift this up into context side effect.
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

  const onClose = () => {
    hideRoundSummary!();
  };

  return (
    <>
      {previousRound && roundSummaryVisible ? (
        <RoundSummary roundId={previousRound.id} onClose={onClose} />
      ) : null}

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
            {roundIsInProgress ? <LeaderboardContainer /> : null}

            {!roundIsInProgress ? (
              <Flex
                flex={1}
                direction="column"
                width="100%"
                minHeight={300}
                justify="center"
              >
                <Button
                  bg="green.200"
                  size="xxl"
                  onClick={() => startRound!()}
                  p={5}
                >
                  Start Round
                </Button>
              </Flex>
            ) : null}
          </Flex>
          <Container textAlign="center">
            <UserList />
          </Container>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Home;
