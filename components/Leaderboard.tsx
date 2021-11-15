import { FC, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';

import { Emoji } from '.prisma/client';
import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';

const MotionBox = motion(Box);

export const mapEmojis = (emojis: Emoji[]) =>
  emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

export type EmojiContainerProps = {
  emoji: EmojiFromListResponsePayload;
};

export const Count = ({ children }) => (
  <Box
    p={1}
    // bg='blue.100'
    d='block'
    w='100%'
    pos='absolute'
    bottom={-5}
    margin='0 auto'
    flex='1'
    direction='row'
  >
    <Text fontSize={12}>{children}</Text>
  </Box>
);

export const EmojiContainer: FC<EmojiContainerProps> = ({ emoji }) => (
  <MotionBox
    display='flex'
    direction='column'
    alignItems='center'
    justify='center'
    key={emoji.native}
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    layout
    pos='relative'
    // bg='pink'
    height='100%'
    flex='1'
    textAlign='center'
  >
    <Text
      style={{ fontSize: 15 + emoji._count.votes * 5 }}
      // bg='green'
      margin='0 auto'
    >
      {emoji.native}
    </Text>

    <Count>{emoji._count.votes}</Count>
  </MotionBox>
);

export const Leaderboard: FC = () => {
  const [emojis, setEmojis] = useState<EmojiFromListResponsePayload[]>([]);

  const { data: emojiData, error: listError } = useSWR(
    `/api/emoji/list`,
    fetcher,
    {
      refreshInterval: 200,
      onSuccess: (data, key, config) => {
        setEmojis(data.emojis);
      },
    }
  );

  const [channel] = useWebsocketChannel(Constants.CHANNELS.MAIN, (message) => {
    // If an emoji was clicked, update its count optimistically.
    if (message.name === Constants.EVENTS.EMOJI_CLICKED) {
      const { emoji } = message.data;
      const newEmojis = [...emojis];

      const targetIndex = newEmojis.findIndex((e) => e.native === emoji.native);

      // If the emoji is not in the list, add it. Otherwise find it in the list and update its count.
      if (targetIndex === -1) {
        newEmojis.push({ ...emoji, _count: { votes: 1 } });
      } else {
        newEmojis[targetIndex]._count.votes += 1;
      }

      setEmojis(newEmojis);
    }
  });

  if (listError) {
    console.log(`Leaderboard list error `, listError);
    return <div>failed to load</div>;
  }
  if (!emojis) return <div>loading...</div>;

  return (
    <>
      <Container textAlign='center'>
        <Heading size='md' mb={5}>
          Leaderboard
        </Heading>
        <SimpleGrid columns={6} spacing={5} alignItems='center'>
          <AnimatePresence>
            {emojis.map((e) => (
              <EmojiContainer emoji={e} key={e.id} />
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </Container>
    </>
  );
};
