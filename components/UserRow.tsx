import Image from 'next/image';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const UserRow = ({ id, image, name }) => (
  <MotionBox
    d='flex'
    alignItems='center'
    position='relative'
    key={`${id}-${name}`}
    layout
    initial={{ opacity: 0, right: -100 }}
    animate={{ opacity: 1, right: 0 }}
    direction='row'
    as='li'
  >
    {image && (
      <Box width={30} height={30} borderRadius={30} overflow='hidden'>
        <Image
          width={30}
          height={30}
          layout='responsive'
          alt='Photo of ${name}'
          src={image}
        />
      </Box>
    )}

    <Text ml={2}>{name}</Text>
  </MotionBox>
);
