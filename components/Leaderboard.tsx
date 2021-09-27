import { FC } from 'react';
import { Emoji } from '@prisma/client';
import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import useSWR from 'swr';

import { fetcher } from '../lib/fetcher';

export const Leaderboard: FC = () => {
  const {
    data: emojiData,
    error: listError,
    mutate: mutateEmojiList,
  } = useSWR(`/api/emoji/list`, fetcher, { refreshInterval: 200 });

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
            <Container key='e.native'>
              <span style={{ fontSize: 15 + e._count.votes * 5 }}>
                {e.native}
              </span>

              <Text fontSize='xs'>{e._count.votes} votes</Text>
            </Container>
          ))}
        </VStack>
      </Container>
    </>
  );
};
