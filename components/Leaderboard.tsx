import { useEffect, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

import { Emoji } from '.prisma/client';
import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';
import { EmojiContainer } from './EmojiContainer';

export const mapEmojis = (emojis: Emoji[]) =>
  emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

export const Leaderboard = () => {
  const [emojis, setEmojis] = useState<EmojiFromListResponsePayload[]>([]);

  const [leaderboardChannel] = useWebsocketChannel(
    Constants.CHANNELS.LEADERBOARD,
    (message) => {
      // If an emoji was clicked, update its count optimistically.
      if (message.name === Constants.EVENTS.EMOJI_CLICKED) {
        const { emoji } = message.data;
        const newEmojis = [...emojis];

        const targetIndex = newEmojis.findIndex(
          (e) => e.native === emoji.native
        );

        // If the emoji is not in the list, add it. Otherwise find it in the list and update its count.
        if (targetIndex === -1) {
          newEmojis.push({ ...emoji, _count: { votes: 1 } });
        } else {
          newEmojis[targetIndex]._count.votes += 1;
          newEmojis.sort((a, b) => b._count.votes - a._count.votes);
        }

        setEmojis(newEmojis);
      }
    }
  );

  if (!emojis) return <div>loading...</div>;

  return (
    <>
      <Heading size="md" mb={5}>
        Leaderboard
      </Heading>
      <Box width="100%">
        <AnimatePresence>
          {emojis.map((e) => (
            <EmojiContainer emoji={e} key={e.id} />
          ))}
        </AnimatePresence>
      </Box>
    </>
  );
};
