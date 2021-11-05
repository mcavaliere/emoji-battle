import { FC } from 'react';
import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

import { useWebsocketChannel, on } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

export const UserList: FC = () => {
  const [channel] = useWebsocketChannel(Constants.CHANNELS.MAIN, (message) => {
    console.log(`UserList received message`, message);
  });

  const { data: usersData, error: usersError } = useSWR(
    `/api/users/list`,
    fetcher,
    { refreshInterval: 200 }
  );

  if (usersError) return <div>failed to load</div>;
  if (!usersData?.users) return <div>loading...</div>;

  const { users } = usersData;

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
