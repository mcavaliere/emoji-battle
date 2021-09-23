import { FC } from 'react';
import { Emoji } from '@prisma/client';
import { Container } from '@chakra-ui/react';

type Props = {
  emojis: Emoji[];
};

export const EmojiGrid: FC<Props> = ({ emojis }) => {
  return <Container>{emojis.map((e) => e.native)}</Container>;
};
