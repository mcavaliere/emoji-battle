import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';

import { usePreviousValue } from '../../lib/hooks/usePreviousValue';

const MotionBox = motion(Box);

export const EmojiCount = ({ value }) => {
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
      alignItems="center"
      animate={controls}
      as="span"
      bg="#313638"
      borderRadius={32}
      d="flex"
      initial={{ scale: 1 }}
      justifyContent="center"
      left={-3}
      lineHeight="10px"
      minH="20px"
      minW="20px"
      opacity={0.5}
      pos="absolute"
      top={-3}
    >
      <Text as="span" color="white" fontSize={10}>
        {value}
      </Text>
    </MotionBox>
  );
};
