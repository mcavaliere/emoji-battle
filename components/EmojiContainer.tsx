import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

import { EmojiCount } from './EmojiCount';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';
import { getRandomHoverAnimationConfig } from '../lib/hoverAnimations';

const MotionBox = motion(Box);

export type EmojiContainerProps = {
  emoji: EmojiFromListResponsePayload;
};

export const hoverInitialState = {
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  skew: 0,
  translateX: 0,
  filter: 'hue-rotate(0) blur(0px)',
};

export const EmojiContainer = ({ emoji }: EmojiContainerProps) => {
  const controls = useAnimation();
  const hoverAnimationConfig = getRandomHoverAnimationConfig();

  // Fade in/slide up on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, []);

  const onMouseEnter = (e) => {
    controls.start(...hoverAnimationConfig.start);
  };

  const onMouseOut = (e) => {
    controls.start(hoverInitialState).then(() => {
      controls.stop();
    });
  };

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
      cursor="pointer"
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
    >
      <Text style={{ fontSize: 15 + emoji._count.votes * 5 }} margin="0 auto">
        {emoji.native}
      </Text>

      <EmojiCount value={emoji._count.votes} />
    </MotionBox>
  );
};
