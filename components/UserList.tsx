import { FC, useEffect, useState } from 'react';
import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { fetcher } from '../lib/fetcher';

import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

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

  const [channel] = useWebsocketChannel(
    Constants.CHANNELS.PLAYERS,
    (message) => {
      console.log(`UserList received message`, message);
    }
  );

  if (!users) return <div>loading...</div>;

  return (
    <Container textAlign='center'>
      <Heading size='md' mb={5}>
        Who&#39;s battling?
      </Heading>
      <VStack>
        {users.map(({ id, name }) => (
          <Text key={id}>{name}</Text>
        ))}
      </VStack>
    </Container>
  );
};
