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
  RECORD_EMOJI_SIZE = 'RECORD_EMOJI_SIZE',
  EMOJI_CLICKED = 'EMOJI_CLICKED',
  NEW_VOTE = 'NEW_VOTE',
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

    case EmojisActions.RECORD_EMOJI_SIZE:
      return {
        ...state,
      };

    case EmojisActions.EMOJI_CLICKED: {
      const { emoji, user, round } = action;
      exec({
        type: 'emojiClickedEffects',
        emoji,
        user,
        round,
      });

      return {
        ...state,
      };
    }

    case EmojisActions.NEW_VOTE: {
      const { emoji, user, round } = action;
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

    default:
      return state;
  }
}

export const EmojisContext =
  createContext<EmojisContextType>(defaultEmojisContext);

EmojisContext.displayName = 'EmojisContext';

export const useEmojisContext = () => {
  return useContext(EmojisContext);
};

export const EmojisProvider = ({ children }) => {
  const [voteChannel] = useWebsocketChannel(
    Constants.CHANNELS.VOTE,
    (message) => {
      console.log(
        `---------------- EmojisProvider -> Vote channel received message`,
        message
      );
      // When a new vote is received, update the emoji list in the context.
      if (message.name === Constants.EVENTS.NEW_VOTE) {
        dispatch({
          type: EmojisActions.NEW_VOTE,
          emoji: message.data.emoji,
          user: message.data.user,
          round: message.data.round,
        });
      }
    }
  );

  const {} = useQuery(
    [Constants.QUERY_CACHE_KEYS.CURRENT_ROUND],
    fetchRoundStatus,
    {
      onSuccess: (data: StatusResponsePayload) => {
        console.log(
          `---------------- EmojisContext -> fetchRoundStatus success: `,
          data
        );
        if (data?.emojis) {
          hydrateEmojis(data.emojis);
        }
      },
    }
  );

  const emojiClickedEffects = (_, effect) => {
    console.log(`---------------- emojiClickedEffects -> effect:`, effect);
    console.log(
      `---------------- emojiClickedEffects -> voteChannel:`,
      voteChannel
    );
    const { emoji, user, round } = effect;

    voteChannel.publish(
      Constants.EVENTS.NEW_VOTE,
      {
        emoji,
        user,
        round,
      },
      (error) => {
        if (error) {
          console.error(
            `---------------- voteChannel.publish -> error:`,
            error
          );
        }
      }
    );

    recordVote(round?.id, emoji);
  };

  const effectMap = {
    emojiClickedEffects,
  };

  const [state, dispatch] = useEffectReducer(
    emojisReducer,
    defaultEmojisContext,
    effectMap
  );

  const hydrateEmojis = (emojis: EmojiFromListResponsePayload[]) => {
    console.log(`---------------- hydrateEmojis `);
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

  console.log(`---------------- EmojisProvider -> state.emojis:`, state.emojis);

  return (
    <EmojisContext.Provider value={{ ...state, recordEmojiSize, emojiClicked }}>
      {children}
    </EmojisContext.Provider>
  );
};
