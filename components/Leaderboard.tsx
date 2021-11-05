import { FC, useState } from 'react';
import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import useSWR from 'swr';

import { Emoji } from '.prisma/client';
import { fetcher } from '../lib/fetcher';
import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';

export const mapEmojis = (emojis: Emoji[]) =>
  emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

export const Leaderboard: FC = () => {
  const [emojis, setEmojis] = useState<EmojiFromListResponsePayload[]>([]);

  const { data: emojiData, error: listError } = useSWR(
    `/api/emoji/list`,
    fetcher,
    {
      refreshInterval: 200,
      onSuccess: (data, key, config) => {
        setEmojis(data.emojis);
      },
    }
  );

  const [channel] = useWebsocketChannel(Constants.CHANNELS.MAIN, (message) => {
    // If an emoji was clicked, update its count optimistically.
    if (message.name === Constants.EVENTS.EMOJI_CLICKED) {
      const { emoji } = message.data;
      const newEmojis = [...emojis];

      const targetIndex = newEmojis.findIndex((e) => e.native === emoji.native);

      // If the emoji is not in the list, add it. Otherwise find it in the list and update its count.
      if (targetIndex === -1) {
        newEmojis.push({ ...emoji, _count: { votes: 1 } });
      } else {
        newEmojis[targetIndex]._count.votes += 1;
      }

      setEmojis(newEmojis);
    }
  });

  if (listError) {
    console.log(`Leaderboard list error `, listError);
    return <div>failed to load</div>;
  }
  if (!emojis) return <div>loading...</div>;

  return (
    <>
      <Container textAlign='center'>
        <Heading size='md' mb={5}>
          Leaderboard
        </Heading>
        <VStack>
          {emojis.map((e) => (
            <Container key={e.native}>
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
