import { useEffect, useState } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { User } from '@prisma/client';

import { UserRow } from '../UserRow/UserRow';
import { fetcher } from '../../lib/fetcher';
import { useWebsocketEvent } from '../../lib/hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Initial load.
  useEffect(() => {
    // TODO: move higher up into context, load with react query.
    async function loadPlayers() {
      try {
        const { users } = await fetcher(`/api/users/list`);

        setUsers(users);
      } catch (e) {}
    }

    loadPlayers();
  }, []);

  // Todo: init this higher up in context, convert this to presentational component.
  useWebsocketEvent(
    Constants.CHANNELS.PLAYERS,
    Constants.EVENTS.PLAYER_JOINED,
    (message) => {
      // Add user to list, if not already present.
      const user = message.data as User;

      setUsers((users = []) => {
        const newUsers = [...users];

        if (users.findIndex((u) => u.id === user.id) === -1) {
          newUsers.push(user);
        }
        return newUsers;
      });
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
