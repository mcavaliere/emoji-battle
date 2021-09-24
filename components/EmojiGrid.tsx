import { FC } from 'react';
import { Emoji } from '@prisma/client';
import { Container, Heading, VStack } from '@chakra-ui/react';
import useSWR from 'swr';

import { fetcher } from '../lib/fetcher';

export const EmojiGrid: FC = () => {
  const {
    data: emojiData,
    error: listError,
    mutate: mutateEmojiList,
  } = useSWR(`/api/emoji/list`, fetcher);

  if (listError) return <div>failed to load</div>;
  if (!emojiData?.emojis) return <div>loading...</div>;

  const { emojis } = emojiData;

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
