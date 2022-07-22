import { createContext, useContext, useEffect } from 'react';
import { BaseEmoji } from 'emoji-mart';

import * as Constants from '../../lib/websocketConstants';
import { Round } from '@prisma/client';
import { ResponsePayload as StatusResponsePayload } from '../../pages/api/rounds/status';
import { status as fetchRoundStatus } from '../../lib/api/rounds';
import { useQuery } from 'react-query';
import { SessionUserType } from '../../lib/types/SessionType';
import { EmojiFromListResponsePayload } from '../../lib/types/EmojiListResponsePayload';
import { EmojisActions, useEmojisActionCreators } from './EmojisActions';
import { useEmojisContextReducer } from './EmojisContextEffects';
import { useEmojisContextWebsocketEvents } from './EmojisContextWebsocketEvents';

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

export const defaultEmojisContext: EmojisContextType = {
  emojis: [] as EmojiFromListResponsePayload[],
  largestEmojiSize: 0,
  recordEmojiSize: () => {},
  emojiClicked: (emoji: BaseEmoji, user: Partial<SessionUserType>) => {},
};

export const EmojisContext =
  createContext<EmojisContextType>(defaultEmojisContext);

EmojisContext.displayName = 'EmojisContext';

export const useEmojisContext = () => {
  return useContext(EmojisContext);
};

export const EmojisProvider = ({ children }) => {
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

  const [state, dispatch] = useEmojisContextReducer();
  const { voteChannel } = useEmojisContextWebsocketEvents();
  const actionCreators = useEmojisActionCreators(dispatch);

  useEffect(() => {
    voteChannel.subscribe(Constants.EVENTS.NEW_VOTE, (message) => {
      // When a new vote is received, update the emoji list in the context.
      dispatch({
        type: EmojisActions.NEW_VOTE,
        emoji: message.data.emoji,
        user: message.data.user,
        round: message.data.round,
      });
    });

    return () => {
      voteChannel.unsubscribe(Constants.EVENTS.NEW_VOTE);
    };
  }, []);

  const hydrateEmojis = (emojis: EmojiFromListResponsePayload[]) => {
    dispatch({ type: EmojisActions.HYDRATE, emojis });
  };

  return (
    <EmojisContext.Provider value={{ ...state, ...actionCreators }}>
      {children}
    </EmojisContext.Provider>
  );
};
