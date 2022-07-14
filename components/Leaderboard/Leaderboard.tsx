import { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

import { Emoji } from '.prisma/client';
import { useWebsocketChannel } from '../../lib/hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';
import { EmojiFromListResponsePayload } from '../../lib/types/EmojiListResponsePayload';
import { EmojiBoxContainer } from '../EmojiBox/EmojiBox';

export const mapEmojis = (emojis: Emoji[]) =>
  emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

export const LeaderboardContainer = () => {
  const [emojis, setEmojis] = useState<EmojiFromListResponsePayload[]>([]);
  const [emojiBoxChannel] = useWebsocketChannel('EMOJI_BOXES', () => {});

  const [leaderboardChannel] = useWebsocketChannel(
    Constants.CHANNELS.LEADERBOARD,
    (message) => {
      // If an emoji was clicked, update its count optimistically.
      if (message.name === Constants.EVENTS.EMOJI_CLICKED) {
        const { emoji } = message.data;
        const newEmojis = [...emojis];

        // Find the emoji in the list, if it's there.
        const targetIndex = newEmojis.findIndex(
          (e) => e.native === emoji.native
        );

        // If the emoji is not in the list, add it. Otherwise update its count, and re-sort by count.
        if (targetIndex === -1) {
          newEmojis.push({ ...emoji, _count: { votes: 1 } });
        } else {
          newEmojis[targetIndex]._count.votes += 1;
          newEmojis.sort((a, b) => b._count.votes - a._count.votes);
        }

        // Let the boxes know when a new emoji has taken the lead.
        if (newEmojis[0].id !== emojis[0].id) {
          emojiBoxChannel.publish(Constants.EVENTS.NEW_LEADER, newEmojis[0]);
        }

        setEmojis(newEmojis);
      }
    }
  );

  if (!emojis) return <LeaderboardLoadingState />;

  return <Leaderboard emojis={emojis} />;
};

export const LeaderboardLoadingState = () => <div>loading...</div>;

export const Leaderboard = ({
  emojis,
}: {
  emojis: EmojiFromListResponsePayload[];
}) => {
  return (
    <>
      <Heading size="md" mb={5}>
        Leaderboard
      </Heading>
      <Box width="100%">
        <AnimatePresence>
          {emojis.map((e) => (
            <EmojiBoxContainer emoji={e} key={e.id} />
          ))}
        </AnimatePresence>
      </Box>
    </>
  );
};
