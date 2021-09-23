import { FC } from 'react';
import { Emoji } from '@prisma/client';
import { Container, Heading, VStack } from '@chakra-ui/react';

type Props = {
  emojis: Emoji[];
};

export const EmojiGrid: FC<Props> = ({ emojis }) => {
  return (
    <>
      <Container textAlign='center'>
        <Heading size='md' mb={5}>
          Leaderboard
        </Heading>
        <VStack>
          {emojis.map((e) => (
            <Container key='e.native'>{e.native}</Container>
          ))}
        </VStack>
      </Container>
    </>
  );
};
