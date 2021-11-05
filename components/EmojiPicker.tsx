import { useState, FC } from 'react';
import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import { Picker, EmojiSet } from 'emoji-mart';

import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';

export type EmojiPickerProps = {
  afterSelect?: (emoji) => void;
};

export const EmojiPicker: FC<EmojiPickerProps> = ({ afterSelect }) => {
  const [emojiSet, setEmojiSet] = useState<EmojiSet>('apple');
  const [channel, ably] = useWebsocketChannel(
    Constants.CHANNELS.MAIN,
    (message) => {
      console.log(`EmojiPicker received message `, message);
    }
  );

  const handleEmojiSelect = async (emoji: any) => {
    // @ts-ignore
    channel.publish(Constants.EVENTS.EMOJI_CLICKED, {
      emoji,
    });

    await fetch('/api/emoji/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ emoji }),
    });

    // @ts-ignore
    channel.publish(Constants.EVENTS.EMOJI_SELECTION_RECORDED, {
      emoji,
    });

    if (afterSelect) {
      afterSelect(emoji);
    }
  };

  return (
    <Container textAlign='center'>
      <Heading size='md' mb={5}>
        Pick an emoji!
      </Heading>
      <HStack justifyContent='center' mb={5}>
        <Button onClick={() => setEmojiSet('apple')}>Apple</Button>
        <Button onClick={() => setEmojiSet('google')}>Google</Button>
        <Button onClick={() => setEmojiSet('twitter')}>Twitter</Button>
        <Button onClick={() => setEmojiSet('facebook')}>Facebook</Button>
      </HStack>
      <Picker set={emojiSet} onSelect={handleEmojiSelect} />
    </Container>
  );
};
