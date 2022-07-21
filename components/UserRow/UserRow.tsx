import { useEffect } from 'react';
import Image from 'next/image';
import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { useWebsocketChannel } from '../../lib/hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';

const MotionBox = motion(Box);

export const UserRow = ({ id, image, name }) => {
  const controls = useAnimation();

  // Highlight the row when this user casts a vote.
  const [voteChannel] = useWebsocketChannel(
    Constants.CHANNELS.VOTE,
    (message) => {
      // TODO: move this to a context-level side effect.
      if (message.name === Constants.EVENTS.NEW_VOTE) {
        const { user } = message.data;

        if (user.id === id) {
          controls.start({
            backgroundColor: ['#F09D51', '#ffffff'],
            transition: {
              duration: 1,
            },
          });
        }
      }
    }
  );

  useEffect(() => {
    controls.start({ opacity: 1, right: 0 });
  }, []);

  return (
    <MotionBox
      display="flex"
      alignItems="center"
      position="relative"
      key={`${id}-${name}`}
      layout
      initial={{ opacity: 0, right: -100 }}
      animate={controls}
      direction="row"
      listStyleType="none"
      as="li"
      p={3}
    >
      {image && (
        <Box
          display="inline-block"
          width={30}
          height={30}
          borderRadius={30}
          overflow="hidden"
          flex={1}
        >
          <Image
            width={30}
            height={30}
            layout="responsive"
            alt="Photo of ${name}"
            src={image}
          />
        </Box>
      )}

      <Text ml={2}>{name}</Text>
    </MotionBox>
  );
};
