import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { Emoji } from '@prisma/client';

import { EmojiFromListResponsePayload } from '../../lib/types/EmojiListResponsePayload';
import { EmojiBoxContainer } from '../EmojiBox/EmojiBox';
import { useEmojisContext } from '../../lib/context/emojis/EmojisContext';

export const mapEmojis = (emojis: Emoji[]) =>
  emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

export const LeaderboardContainer = () => {
  const { emojis } = useEmojisContext();

  if (!emojis) return <LeaderboardLoadingState />;

  return <Leaderboard emojis={emojis} />;
};

export const LeaderboardLoadingState = () => <div>loading...</div>;

export type LeaderboardProps = {
  emojis: EmojiFromListResponsePayload[];
};

export const Leaderboard = ({ emojis }: LeaderboardProps) => {
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
