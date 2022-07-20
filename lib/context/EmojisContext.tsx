import { createContext, useContext } from 'react';
import { BaseEmoji } from 'emoji-mart';
import { useEffectReducer } from '../hooks/useEffectReducer';
import * as Constants from '../../lib/websocketConstants';
import { useWebsocketChannel } from '../../lib/hooks/useWebsocketChannel';
import { Emoji, Round } from '@prisma/client';
import { ResponsePayload as StatusResponsePayload } from '../../pages/api/rounds/status';
import { status as fetchRoundStatus } from '../../lib/api/rounds';
import { create as recordVote } from '../../lib/api/votes';
import { useQuery } from 'react-query';
import { SessionUserType } from '../../lib/types/SessionType';
import { EmojiFromListResponsePayload } from '../../lib/types/EmojiListResponsePayload';

export type EmojisContextType = {
  emojis: EmojiFromListResponsePayload[];
  largestEmojiSize: number;
  recordEmojiSize: (size: number) => void;
  emojiClicked: (
    emoji: BaseEmoji,
    user: Partial<SessionUserType>,
    round: Round
  ) => void;
};

export enum EmojisActions {
  HYDRATE = 'HYDRATE',
  ADD_EMOJI = 'ADD_EMOJI',
  RECORD_EMOJI_SIZE = 'RECORD_EMOJI_SIZE',
  EMOJI_CLICKED = 'EMOJI_CLICKED',
}

export const defaultEmojisContext: EmojisContextType = {
  emojis: [] as EmojiFromListResponsePayload[],
  largestEmojiSize: 0,
  recordEmojiSize: () => {},
  emojiClicked: (emoji: BaseEmoji, user: Partial<SessionUserType>) => {},
};

export function emojisReducer(state, action, exec) {
  console.log(`ACTION: ${action.type}`, action);
  switch (action.type) {
    case EmojisActions.HYDRATE:
      return {
        ...state,
        emojis: action.emojis,
      };

    case EmojisActions.ADD_EMOJI:
      return {
        ...state,
      };

    case EmojisActions.RECORD_EMOJI_SIZE:
      return {
        ...state,
      };

    case EmojisActions.EMOJI_CLICKED:
      const { emoji, user, round } = action;

      exec({ type: 'emojiClickedEffects', emoji, user, round });

      const newEmojis = [...state.emojis];

      // Find the emoji in the list, if it's there.
      const targetIndex = newEmojis.findIndex((e) => e.native === emoji.native);

      // If the emoji is not in the list, add it. Otherwise update its count, and re-sort by count.
      if (targetIndex === -1) {
        newEmojis.push({ ...emoji, voteCount: 1 });
      } else {
        newEmojis[targetIndex].voteCount += 1;
        newEmojis.sort((a, b) => b.voteCount - a.voteCount);
      }

      // Let the boxes know when a new emoji has taken the lead.
      if (
        newEmojis.length &&
        state.emojis.length &&
        newEmojis[0].id !== state.emojis[0].id
      ) {
        // emojiBoxChannel.publish(Constants.EVENTS.NEW_LEADER, {
        //   emoji: newEmojis[0],
        // });
      }

      return {
        ...state,
        emojis: newEmojis,
      };
  }
}

export const EmojisContext =
  createContext<EmojisContextType>(defaultEmojisContext);

EmojisContext.displayName = 'EmojisContext';

export const useEmojisContext = () => {
  return useContext(EmojisContext);
};

export const EmojisProvider = ({ children }) => {
  const [voteChannel] = useWebsocketChannel(Constants.CHANNELS.VOTE, () => {});
  const [emojiBoxChannel] = useWebsocketChannel(
    Constants.CHANNELS.EMOJI_BOXES,
    () => {}
  );
  const [leaderboardChannel] = useWebsocketChannel(
    Constants.CHANNELS.LEADERBOARD,
    () => {}
  );

  const {} = useQuery(
    [Constants.QUERY_CACHE_KEYS.CURRENT_ROUND],
    fetchRoundStatus,
    {
      onSuccess: (data: StatusResponsePayload) => {
        if (data?.emojis) {
          hydrateEmojis(data.emojis);
        }
      },
    }
  );

  const emojiClickedEffects = (_, { emoji, user, round }, dispatch) => {
    // TODO: dispatch this up to a reducer, and fire these websocket/API events in a side effect.
    leaderboardChannel.publish(Constants.EVENTS.EMOJI_CLICKED, {
      emoji,
      user,
    });

    voteChannel.publish(Constants.EVENTS.EMOJI_CLICKED, {
      emoji,
      user,
    });

    // TODO: where do round and emoji data go in context? How do they get associated?
    recordVote(round?.id, emoji);
  };

  const effectMap = {
    emojiClickedEffects,
  };

  const [state, dispatch] = useEffectReducer(
    emojisReducer,
    defaultEmojisContext
  );

  const hydrateEmojis = (emojis: EmojiFromListResponsePayload[]) => {
    dispatch({ type: EmojisActions.HYDRATE, emojis });
  };

  /**
   * Record the size (aka, # votes) anytime a vote happens. This is used to calculate the size of a row.
   * @param size {Number}
   */
  const recordEmojiSize = (size: number) => {
    dispatch({ type: EmojisActions.RECORD_EMOJI_SIZE, size });
  };

  const emojiClicked = (
    emoji: BaseEmoji,
    user: Partial<SessionUserType>,
    round: Round
  ) => {
    dispatch({ type: EmojisActions.EMOJI_CLICKED, emoji, user, round });
  };

  return (
    <EmojisContext.Provider value={{ ...state, recordEmojiSize, emojiClicked }}>
      {children}
    </EmojisContext.Provider>
  );
};
