import { Heading, VStack } from '@chakra-ui/react';
import { User } from '@prisma/client';

import { UserRow } from '../UserRow/UserRow';

export type UserListProps = {
  users: User[];
};

export const UserList = ({ users }: UserListProps) => {
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
