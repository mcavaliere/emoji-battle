import { useRef } from 'react';
import { Heading, HStack } from '@chakra-ui/react';

import data from '@emoji-mart/data';
import { Picker as EmojiMartPicker } from 'emoji-mart';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

import { useWebsocketChannel } from '../lib/hooks/useWebsocketChannel';
import * as Constants from '../lib/websocketConstants';
import { create as recordVote } from '../lib/api/votes';
import { useRoundContext } from '../lib/context/RoundContext';

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
  const [voteChannel] = useWebsocketChannel(Constants.CHANNELS.VOTE, () => {});
  const { data: session } = useSession();
  const { user } = session as Session;

  const [leaderboardChannel] = useWebsocketChannel(
    Constants.CHANNELS.LEADERBOARD,
    () => {}
  );

  const handleEmojiSelect = async (emoji: any) => {
    if (!round) {
      return;
    }

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

    recordVote(round?.id, emoji);
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
