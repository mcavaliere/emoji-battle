import { FC, useEffect, useState } from 'react';
import { Box, Container, Heading, VStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';

import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

const MotionBox = motion(Box);

export const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>();

  // Initial load.
  useEffect(() => {
    async function loadPlayers() {
      const { users } = await fetcher(`/api/users/list`);
      setUsers(users);
    }

    loadPlayers();
  }, []);

  const [playersChannel] = useWebsocketChannel(
    Constants.CHANNELS.PLAYERS,
    (message) => {
      if (message.name === Constants.EVENTS.PLAYER_JOINED) {
        const user = message.data as User;
        setUsers((users) => [...(users as User[]), user]);
      }
    }
  );

  if (!users) return <div>loading...</div>;

  return (
    <Container textAlign='center'>
      <Heading size='md' mb={5}>
        Who&#39;s battling?
      </Heading>
      <VStack>
        {users?.map(({ id, name, image }) => (
          <MotionBox
            position='relative'
            key={`${id}-${name}`}
            layout
            initial={{ opacity: 0, right: -100 }}
            animate={{ opacity: 1, right: 0 }}
          >
            <Text>{name}</Text>
          </MotionBox>
        ))}
      </VStack>
    </Container>
  );
};
