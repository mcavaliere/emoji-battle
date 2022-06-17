import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

import { usePreviousValue } from '../lib/hooks/usePreviousValue';
import { EmojiCount } from './EmojiCount';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';

const MotionBox = motion(Box);

export type EmojiContainerProps = {
  emoji: EmojiFromListResponsePayload;
};

export const EmojiContainer = ({ emoji }: EmojiContainerProps) => {
  const controls = useAnimation();
  const previousValue = usePreviousValue(emoji._count.votes);

  // Fade in/slide up on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, []);

  return (
    <MotionBox
      align="flex-start"
      animate={controls}
      direction="column"
      display="flex"
      exit={{ opacity: 0 }}
      float="left"
      height={150}
      initial={{ opacity: 0, y: 100 }}
      justify="flex-start"
      key={emoji.native}
      layout
      lineHeight="1"
      mr={4}
      pos="relative"
      textAlign="center"
      transition={{ duration: 0.2 }}
    >
      <Text style={{ fontSize: 15 + emoji._count.votes * 5 }} margin="0 auto">
        {emoji.native}
      </Text>

      <EmojiCount value={emoji._count.votes} />
    </MotionBox>
  );
};
