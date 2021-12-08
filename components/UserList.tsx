import { FC, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  chakra,
} from '@chakra-ui/react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

const MotionBox = motion(Box);

export const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

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
    <Container textAlign='center'>
      <Heading size='md' mb={5}>
        Who&#39;s battling?
      </Heading>
      <VStack as='ul'>
        {users?.map(({ id, name, image }) => (
          <MotionBox
            d='flex'
            alignItems='center'
            position='relative'
            key={`${id}-${name}`}
            layout
            initial={{ opacity: 0, right: -100 }}
            animate={{ opacity: 1, right: 0 }}
            direction='row'
            as='li'
          >
            {image && (
              <Box width={30} height={30} borderRadius={30} overflow='hidden'>
                <Image
                  width={30}
                  height={30}
                  layout='responsive'
                  alt='Photo of ${name}'
                  src={image}
                />
              </Box>
            )}

            <Text ml={2}>{name}</Text>
          </MotionBox>
        ))}
      </VStack>
    </Container>
  );
};
