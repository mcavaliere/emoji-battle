import { useState, FC } from 'react';
import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import { Picker, EmojiSet } from 'emoji-mart';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

export type EmojiPickerProps = {
  afterSelect?: (emoji) => void;
};

export const EmojiPicker = ({ afterSelect }: EmojiPickerProps) => {
  const [emojiSet, setEmojiSet] = useState<EmojiSet>('apple');
  const [voteChannel] = useWebsocketChannel(Constants.CHANNELS.VOTE, () => {});
  const { data: session } = useSession();

  const { user } = session as Session;

  const [leaderboardChannel] = useWebsocketChannel(
    Constants.CHANNELS.LEADERBOARD,
    () => {}
  );

  const handleEmojiSelect = async (emoji: any) => {
    // @ts-ignore
    leaderboardChannel.publish(Constants.EVENTS.EMOJI_CLICKED, {
      emoji,
      user,
    });

    // @ts-ignore
    voteChannel.publish(Constants.EVENTS.EMOJI_CLICKED, {
      emoji,
      user,
    });

    await fetch('/api/emoji/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ emoji }),
    });

    if (afterSelect) {
      afterSelect(emoji);
    }
  };

  return (
    <>
      <Heading size="md" mb={5}>
        Pick an emoji!
      </Heading>
      <HStack justifyContent="center" mb={5}>
        <Button onClick={() => setEmojiSet('apple')}>Apple</Button>
        <Button onClick={() => setEmojiSet('google')}>Google</Button>
        <Button onClick={() => setEmojiSet('twitter')}>Twitter</Button>
        <Button onClick={() => setEmojiSet('facebook')}>Facebook</Button>
      </HStack>
      <Picker set={emojiSet} onSelect={handleEmojiSelect} />
    </>
  );
};
