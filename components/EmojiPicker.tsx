import { useState, FC } from 'react';
import { Button, Container, HStack } from '@chakra-ui/react';
import { Picker, EmojiSet } from 'emoji-mart';

export type EmojiPickerProps = {
  afterSelect?: (emoji) => void;
};

export const EmojiPicker: FC<EmojiPickerProps> = ({ afterSelect }) => {
  const [emojiSet, setEmojiSet] = useState<EmojiSet>('apple');

  const handleEmojiSelect = async (emoji: any) => {
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
    <Container>
      <HStack>
        <Button onClick={() => setEmojiSet('apple')}>Apple</Button>
        <Button onClick={() => setEmojiSet('google')}>Google</Button>
        <Button onClick={() => setEmojiSet('twitter')}>Twitter</Button>
        <Button onClick={() => setEmojiSet('facebook')}>Facebook</Button>
      </HStack>
      <Picker set={emojiSet} onSelect={handleEmojiSelect} />
    </Container>
  );
};
