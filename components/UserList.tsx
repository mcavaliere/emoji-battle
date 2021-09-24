import { FC } from 'react';
import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

export const UserList: FC = () => {
  const {
    data: usersData,
    error: usersError,
    mutate: mutateUsersList,
  } = useSWR(`/api/users/list`, fetcher);

  if (usersError) return <div>failed to load</div>;
  if (!usersData?.users) return <div>loading...</div>;

  const { users } = usersData;

  return (
    <Container textAlign='center'>
      <Heading size='md' mb={5}>
        Who's battling?
      </Heading>
      <VStack>
        {users.map(({ id, name }) => (
          <Text key={id}>{name}</Text>
        ))}
      </VStack>
    </Container>
  );
};
