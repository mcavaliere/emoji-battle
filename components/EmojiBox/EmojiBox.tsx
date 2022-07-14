import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

import { AnimationConfig } from '../../lib/animationConfigs';
import { EmojiCount } from '../EmojiCount/EmojiCount';
import { EmojiFromListResponsePayload } from '../../lib/types/EmojiListResponsePayload';
import { getRandomAnimationConfig } from '../../lib/animationConfigs';
import { useWebsocketChannel } from '../../lib/hooks/useWebsocketChannel';

const MotionBox = motion(Box);

export type EmojiBoxContainerProps = {
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

/**
 * Container component for Emoji display.
 */
export const EmojiBoxContainer = ({ emoji }: EmojiBoxContainerProps) => {
  const animationConfig: AnimationConfig = getRandomAnimationConfig();

  return <EmojiBox emoji={emoji} animationConfig={animationConfig} />;
};

export type EmojiBoxProps = {
  emoji: EmojiFromListResponsePayload;
  animationConfig: AnimationConfig;
};

/**
 * Presentational component for Emoji display, with hover animations.
 */
export const EmojiBox = ({ emoji, animationConfig }: EmojiBoxProps) => {
  const controls = useAnimation();
  const channelName = `EMOJI_BOXES`;
  const [channel] = useWebsocketChannel(channelName, (data) => {
    console.log(`Channel ${channelName} received `, data);
  });

  // Fade in/slide up on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, []);

  const onMouseEnter = (e) => {
    controls.start(...animationConfig.start);
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
