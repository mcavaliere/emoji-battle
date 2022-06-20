import { FC, useEffect, useState } from 'react';
import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';

import { UserRow } from '../components/UserRow';
import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

export const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Initial load.
  useEffect(() => {
    async function loadPlayers() {
      try {
        const { users } = await fetcher(`/api/users/list`);

        setUsers(users);
      } catch (e) {}
    }

    loadPlayers();
  }, []);

  const [playersChannel] = useWebsocketChannel(
    Constants.CHANNELS.PLAYERS,
    (message) => {
      // Add user to list, if not already present.
      if (message.name === Constants.EVENTS.PLAYER_JOINED) {
        const user = message.data as User;

        setUsers((users = []) => {
          const newUsers = [...users];

          if (users.findIndex((u) => u.id === user.id) === -1) {
            newUsers.push(user);
          }
          return newUsers;
        });
      }
    }
  );

  if (!users) return <div>loading...</div>;

  return (
    <>
      <Heading size="md" mb={5}>
        Who&#39;s battling?
      </Heading>
      <VStack as="ul">
        {users?.map((user) => (
          <UserRow {...user} key={user.id} />
        ))}
      </VStack>
    </>
  );
};
