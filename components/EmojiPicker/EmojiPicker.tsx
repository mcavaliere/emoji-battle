import { useRef } from 'react';
import { Box, Heading, HStack } from '@chakra-ui/react';

import data from '@emoji-mart/data';
import { Picker as EmojiMartPicker, BaseEmoji } from 'emoji-mart';
import { useSession } from 'next-auth/react';

import { useRoundContext } from '../../lib/context/round/RoundContext';
import { useEmojisContext } from '../../lib/context/emojis/EmojisContext';
import { SessionType } from '../../lib/types/SessionType';

export function Picker(props) {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const moduleRef = useRef<EmojiMartPicker | null>(null);

  // Use deferred import to make emoji-mart not break during SSR https://github.com/missive/emoji-mart/issues/575#issuecomment-1111323710
  const handleDivRef = (divEl) => {
    pickerRef.current = divEl;
    if (!moduleRef.current) {
      import('emoji-mart').then(
        // @ts-ignore
        (m) =>
          (moduleRef.current = new m.Picker({ ...props, ref: pickerRef, data }))
      );
    }
  };

  return <div ref={handleDivRef} />;
}

export const EmojiPicker = () => {
  const { round } = useRoundContext();
  const { emojiClicked } = useEmojisContext();

  const { data: session } = useSession();
  const { user } = session as SessionType;

  const handleEmojiSelect = async (emoji: BaseEmoji) => {
    if (!round) {
      return;
    }

    // Dispatch an event up to the EmojisContext,
    //  have it alter state and fire off effects.
    emojiClicked(emoji, user, round);
  };

  return (
    <>
      <Heading size="md" mb={5}>
        Pick an emoji!
      </Heading>
      <HStack justifyContent="center" mb={5}>
        <Picker onEmojiSelect={handleEmojiSelect} />
      </HStack>
    </>
  );
};
