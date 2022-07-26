import { useCallback, useEffect, useRef } from 'react';
import { Heading, HStack } from '@chakra-ui/react';

import data from '@emoji-mart/data';
import { Picker as EmojiMartPicker, BaseEmoji } from 'emoji-mart';
import { useSession } from 'next-auth/react';

import { useRoundContext } from '../../lib/context/round/RoundContext';
import { useEmojisContext } from '../../lib/context/emojis/EmojisContext';
import { SessionType } from '../../lib/types/SessionType';

export function Picker(props) {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const showEmojis = useRef<boolean>(true);

  useEffect(() => {
    if (showEmojis.current) {
      showEmojis.current = false;
      // Use deferred import to make emoji-mart not break during SSR:
      //  https://github.com/missive/emoji-mart/issues/575#issuecomment-1111323710
      //  https://github.com/missive/emoji-mart/issues/575#issuecomment-1186794925
      import('emoji-mart').then((EmojiMart) => {
        new EmojiMart.Picker({ ...props, data, ref: pickerRef });
      });
    }
  }, [props]);

  return <div ref={pickerRef} />;
}

export const EmojiPicker = () => {
  const { round } = useRoundContext();
  const { emojiClicked } = useEmojisContext();

  const { data: session } = useSession();
  const { user } = session as SessionType;

  const handleEmojiSelect = useCallback(async (emoji: BaseEmoji) => {
    if (!round) {
      return;
    }

    // Dispatch an event up to the EmojisContext,
    //  have it alter state and fire off effects.
    emojiClicked(emoji, user, round);
  }, []);

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
