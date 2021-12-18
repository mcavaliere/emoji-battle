import { FC, useEffect, useState } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import { Emoji } from '.prisma/client';
import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';
import { usePreviousValue } from '../lib/hooks/usePreviousValue';

const MotionBox = motion(Box);

export const mapEmojis = (emojis: Emoji[]) =>
  emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

export type EmojiContainerProps = {
  emoji: EmojiFromListResponsePayload;
};

export const Count = ({ value }) => {
  const controls = useAnimation();
  const previousValue = usePreviousValue(value);

  useEffect(() => {
    if (!previousValue || value > previousValue) {
      controls.start({
        scale: [1, 1.5, 1],
        transition: {
          duration: 0.5,
        },
      });
    }
  }, [value]);

  return (
    <MotionBox
      alignItems='center'
      animate={controls}
      as='span'
      bg='#313638'
      borderRadius={32}
      d='flex'
      initial={{ scale: 1 }}
      justifyContent='center'
      left={-3}
      lineHeight='10px'
      minH='20px'
      minW='20px'
      opacity={0.5}
      pos='absolute'
      top={-3}
    >
      <Text as='span' color='white' fontSize={10}>
        {value}
      </Text>
    </MotionBox>
  );
};

export const EmojiContainer: FC<EmojiContainerProps> = ({ emoji }) => {
  const controls = useAnimation();
  const previousValue = usePreviousValue(emoji._count.votes);

  // Fade in/slide up on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, []);

  return (
    <MotionBox
      align='flex-start'
      animate={controls}
      direction='column'
      display='flex'
      exit={{ opacity: 0 }}
      float='left'
      height={150}
      initial={{ opacity: 0, y: 100 }}
      justify='flex-start'
      key={emoji.native}
      layout
      lineHeight='1'
      mr={4}
      pos='relative'
      textAlign='center'
      transition={{ duration: 0.2 }}
    >
      <Text style={{ fontSize: 15 + emoji._count.votes * 5 }} margin='0 auto'>
        {emoji.native}
      </Text>

      <Count value={emoji._count.votes} />
    </MotionBox>
  );
};

export const Leaderboard: FC = () => {
  const [emojis, setEmojis] = useState<EmojiFromListResponsePayload[]>([]);

  // Initial load: fetch current list of emoji votes.
  useEffect(() => {
    async function loadEmoji() {
      try {
        const emojiFromApi = await fetcher(`/api/emoji/list`);

        setEmojis(emojiFromApi.emojis);
      } catch (error) {
        console.warn(`error from initial emoji load:`, error);
      }
    }

    loadEmoji();
  }, []);

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
      <Heading size='md' mb={5}>
        Leaderboard
      </Heading>
      <Box width='100%'>
        <AnimatePresence>
          {emojis.map((e) => (
            <EmojiContainer emoji={e} key={e.id} />
          ))}
        </AnimatePresence>
      </Box>
    </>
  );
};
